import cv2
import os
import numpy as np
import json
from pathlib import Path

class FaceRecognitionModel:
    def __init__(self, models_path="Models"):
        self.models_path = Path(models_path)
        
        # MUCH STRICTER THRESHOLDS
        self.confidence_threshold = 40.0    # Much stricter (was 50.0)
        self.min_face_size = 80             # Keep same
        self.max_distance_threshold = 50    # Much stricter (was 60)
        
        # Require VERY high match quality
        self.min_match_confidence = 0.80    # 80% minimum (was 0.75)
        
        # Face detection with better parameters
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.recognizer = cv2.face.LBPHFaceRecognizer_create(
            radius=2,        # More detailed local patterns
            neighbors=12,    # More neighbors for better accuracy
            grid_x=8,        # Higher resolution grid
            grid_y=8
        )
        
        # Training data
        self.class_names = []
        self.team_data = {}
        self.model_trained = False
        self.training_features = []
        
        print("Initializing Face Recognition Model...")
        print(f"Models path: {self.models_path}")
        
        # Load and train
        self.load_team_data()
        self.load_and_encode_images()

    def load_team_data(self):
        """Load team member data"""
        team_data_path = self.models_path / "team_data.json"
        if team_data_path.exists():
            with open(team_data_path, 'r') as f:
                self.team_data = json.load(f)
            print(f"Loaded team data for {len(self.team_data)} members")
        else:
            # Create enhanced default team data if none exists
            self.team_data = {
                "Mukhtar_Fathiyah": {
                    "full_name": "Mukhtar Fathiyah",
                    "role": "Lead Software Engineer",
                    "department": "Technology & Innovation",
                    "employee_id": "EMP-001",
                    "email": "mukhtar.fathiyah@facetrustafrica.com",
                    "phone": "+234-803-123-4567",
                    "access_level": "Senior",
                    "hire_date": "2024-01-15",
                    "nationality": "Nigerian",
                    "gender": "Male",
                    "verification_count": 1
                },
                "Abdulrasaq_Abdulrasaq": {
                    "full_name": "Abdulrasaq Abdulrasaq", 
                    "role": "Senior Data Scientist",
                    "department": "AI Research & Development",
                    "employee_id": "EMP-002",
                    "email": "abdulrasaq@facetrustafrica.com",
                    "phone": "+234-805-987-6543",
                    "access_level": "Senior",
                    "hire_date": "2024-02-01",
                    "nationality": "Nigerian", 
                    "gender": "Male",
                    "verification_count": 1
                }
            }
            # Save default data
            with open(team_data_path, 'w') as f:
                json.dump(self.team_data, f, indent=2)
            print("Created default team data")

    def validate_face_quality(self, face_roi):
        """Enhanced face quality validation"""
        try:
            height, width = face_roi.shape
            
            # Size check
            if height < self.min_face_size or width < self.min_face_size:
                return False, f"Face too small ({width}x{height})"
            
            # Brightness check
            brightness = np.mean(face_roi)
            if brightness < 40 or brightness > 220:
                return False, f"Poor lighting (brightness: {brightness:.1f})"
            
            # Enhanced sharpness check
            laplacian_var = cv2.Laplacian(face_roi, cv2.CV_64F).var()
            if laplacian_var < 100:  # Stricter blur detection
                return False, f"Image too blurry (sharpness: {laplacian_var:.1f})"
            
            # Contrast check
            contrast = face_roi.std()
            if contrast < 25:  # Higher contrast requirement
                return False, f"Low contrast ({contrast:.1f})"
            
            return True, f"Good quality (size: {width}x{height}, sharpness: {laplacian_var:.1f})"
            
        except Exception as e:
            return False, f"Quality check failed: {str(e)}"

    def load_and_encode_images(self):
        """Enhanced training with multiple samples per person"""
        try:
            faces = []
            labels = []
            self.class_names = []
            self.training_features = []
            
            image_files = list(self.models_path.glob("*.jpg")) + \
                         list(self.models_path.glob("*.jpeg")) + \
                         list(self.models_path.glob("*.png"))
            
            print(f"Found {len(image_files)} image files")
            
            for idx, image_path in enumerate(image_files):
                name = image_path.stem
                print(f"\nProcessing: {name}")
                
                image = cv2.imread(str(image_path))
                if image is None:
                    print(f"✗ Could not load: {name}")
                    continue
                
                gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
                
                # Better face detection
                detected_faces = self.face_cascade.detectMultiScale(
                    gray,
                    scaleFactor=1.05,    # More precise
                    minNeighbors=6,      # Stricter
                    minSize=(self.min_face_size, self.min_face_size),
                    maxSize=(500, 500),  # Limit max size
                    flags=cv2.CASCADE_SCALE_IMAGE
                )
                
                if len(detected_faces) == 0:
                    print(f"✗ No face detected in: {name}")
                    continue
                
                if len(detected_faces) > 1:
                    print(f"⚠ Multiple faces detected, using largest")
                    detected_faces = [max(detected_faces, key=lambda f: f[2] * f[3])]
                
                # Process face
                (x, y, w, h) = detected_faces[0]
                face_roi = gray[y:y+h, x:x+w]
                
                print(f"Face size: {face_roi.shape}")
                
                # Quality validation
                is_good_quality, quality_msg = self.validate_face_quality(face_roi)
                print(f"Quality: {quality_msg}")
                
                if not is_good_quality:
                    print(f"✗ Rejected: {quality_msg}")
                    continue
                
                # Create multiple training samples for better recognition
                face_samples = []
                
                # Original face
                face_resized = cv2.resize(face_roi, (200, 200))
                face_samples.append(face_resized)
                
                # Add slight variations for better training
                # Brightness variations
                bright_face = cv2.convertScaleAbs(face_resized, alpha=1.2, beta=10)
                dark_face = cv2.convertScaleAbs(face_resized, alpha=0.8, beta=-10)
                face_samples.extend([bright_face, dark_face])
                
                # Add histogram equalized version
                eq_face = cv2.equalizeHist(face_resized)
                face_samples.append(eq_face)
                
                # Store all samples
                for sample in face_samples:
                    faces.append(sample)
                    labels.append(idx)
                
                self.class_names.append(name)
                self.training_features.append(face_resized.copy())
                
                print(f"✓ Added {len(face_samples)} training samples for: {name}")
            
            print(f"\nTraining Summary:")
            print(f"Members: {len(self.class_names)}")
            print(f"Total training samples: {len(faces)}")
            print(f"Class names: {self.class_names}")
            
            if len(faces) < 2:
                print("ERROR: Need at least 2 training samples")
                self.model_trained = False
                return
            
            # Train recognizer
            faces = np.array(faces)
            labels = np.array(labels)
            
            self.recognizer.train(faces, labels)
            self.model_trained = True
            
            print(f"✓ Model trained successfully!")
            print(f"✓ Confidence threshold: {self.confidence_threshold}")
            print(f"✓ Min match confidence: {self.min_match_confidence}")
            
        except Exception as e:
            print(f"ERROR: Training failed: {str(e)}")
            import traceback
            traceback.print_exc()
            self.model_trained = False

    def recognize_face_from_image(self, image):
        """STRICT face recognition with enhanced validation"""
        try:
            if not self.model_trained:
                return {
                    "success": False,
                    "error": "Model not trained",
                    "faces_found": 0,
                    "results": []
                }
            
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Same detection parameters as training
            faces = self.face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.05,
                minNeighbors=6,
                minSize=(self.min_face_size, self.min_face_size),
                maxSize=(500, 500),
                flags=cv2.CASCADE_SCALE_IMAGE
            )
            
            if len(faces) == 0:
                return {
                    "success": True,
                    "faces_found": 0,
                    "results": [],
                    "message": "No faces detected"
                }
            
            results = []
            
            for (x, y, w, h) in faces:
                face_roi = gray[y:y+h, x:x+w]
                
                # Quality check
                is_good_quality, quality_msg = self.validate_face_quality(face_roi)
                if not is_good_quality:
                    results.append({
                        "matched": False,
                        "name": "Unknown",
                        "confidence": 0.0,
                        "reason": f"Poor quality: {quality_msg}",
                        "team_data": {},
                        "bounding_box": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)}
                    })
                    continue
                
                # Resize and normalize
                face_roi = cv2.resize(face_roi, (200, 200))
                face_roi = cv2.equalizeHist(face_roi)  # Normalize histogram
                
                # Get prediction
                label, distance = self.recognizer.predict(face_roi)
                
                # Calculate confidence (0-1 scale)
                confidence = max(0, (self.confidence_threshold - distance) / self.confidence_threshold)
                
                print(f"Recognition: label={label}, distance={distance:.1f}, confidence={confidence:.3f}")
                
                # VERY STRICT matching conditions
                is_valid_match = (
                    distance <= self.confidence_threshold and      # Must be under threshold
                    confidence >= self.min_match_confidence and    # Must meet minimum confidence
                    label < len(self.class_names) and              # Valid label
                    label >= 0 and                                 # Non-negative
                    distance <= 45.0                               # Additional strict distance check
                )
                
                print(f"MATCH DECISION:")
                print(f"  Distance: {distance:.1f} (max: {self.confidence_threshold})")
                print(f"  Confidence: {confidence:.3f} (min: {self.min_match_confidence})")
                print(f"  Valid match: {is_valid_match}")
                
                if is_valid_match:
                    name = self.class_names[label]
                    team_data = self.team_data.get(name, {})
                    print(f"  ✅ VERIFIED: {name}")
                    
                    results.append({
                        "matched": True,
                        "name": name,
                        "confidence": confidence,
                        "distance": distance,
                        "team_data": team_data,
                        "bounding_box": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)},
                        "reason": f"Verified: {name} ({confidence:.1%} confidence)"
                    })
                else:
                    print(f"  ❌ REJECTED - Not authorized")
                    
                    results.append({
                        "matched": False,
                        "name": "Unknown",
                        "confidence": confidence,
                        "distance": distance,
                        "reason": f"UNAUTHORIZED ACCESS - Not a team member (Score: {confidence:.1%})",
                        "team_data": {},
                        "bounding_box": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)}
                    })
            
            return {
                "success": True,
                "faces_found": len(faces),
                "results": results
            }
            
        except Exception as e:
            print(f"Recognition error: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "faces_found": 0,
                "results": []
            }

    def update_thresholds(self, confidence_threshold=None, max_distance=None, min_face_size=None):
        """Update recognition thresholds for fine-tuning accuracy"""
        if confidence_threshold is not None:
            self.confidence_threshold = confidence_threshold
        if max_distance is not None:
            self.max_distance_threshold = max_distance
        if min_face_size is not None:
            self.min_face_size = min_face_size
        
        print(f"Updated thresholds: confidence={self.confidence_threshold}, max_distance={self.max_distance_threshold}, min_face={self.min_face_size}")

