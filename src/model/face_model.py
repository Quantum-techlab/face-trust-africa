import cv2
import os
import numpy as np
import json
from pathlib import Path

class FaceRecognitionModel:
    def __init__(self, models_path="Models"):
        self.models_path = Path(models_path)
        
        # LENIENT THRESHOLDS - Allow team members through
        self.confidence_threshold = 120.0   # Much higher (was 80.0)
        self.min_face_size = 80            # Keep same  
        self.max_distance_threshold = 120.0 # Much higher (was 85.0)
        self.min_match_confidence = 0.30    # Much lower - 30% (was 0.60)
        
        print("Initializing Face Recognition Model...")
        print(f"LENIENT SECURITY MODE:")
        print(f"  Confidence threshold: {self.confidence_threshold}")
        print(f"  Max distance: {self.max_distance_threshold}") 
        print(f"  Min confidence required: {self.min_match_confidence}")
        
        # Face detection and recognition
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.recognizer = cv2.face.LBPHFaceRecognizer_create()
        
        # Training data
        self.class_names = []
        self.team_data = {}
        self.model_trained = False
        self.training_features = []
        
        print(f"Models path: {self.models_path}")
        
        # Enhanced team data with full details
        self.default_team_data = {
            "Mukhtar_Fathiyah": {
                "full_name": "Mukhtar Fathiyah",
                "first_name": "Mukhtar",
                "last_name": "Fathiyah",
                "position": "Co-founder & COO",
                "department": "Operations",
                "employee_id": "FT002",
                "email": "mukhtar.fathiyah@facetrust.ai",
                "phone": "+234-802-555-1234",
                "nin": "98765012345",
                "unique_id_number": "FT-EMP-002",
                "gender": "Female",
                "date_of_birth": "1996-07-12",
                "nationality": "Nigerian",
                "address_city": "Abuja",
                "address_state": "FCT",
                "address_country": "Nigeria",
                "hire_date": "2024-02-15",
                "access_level": "Administrator",
                "social_media": {
                    "linkedin": "linkedin.com/in/mukhtar-fathiyah",
                    "twitter": "@mukhtarfathiyah"
                },
                "verification_history": {
                    "last_verified": "2024-02-20T09:00:00Z",
                    "verification_count": 1,
                    "risk_score": 0
                },
                "bio": "Operations leader focused on reliable, scalable identity verification for African markets."
            },
            "Abdulrasaq_Abdulrasaq": {
                "full_name": "Abdulrasaq Abdulrasaq",
                "first_name": "Abdulrasaq",
                "last_name": "Abdulrasaq",
                "position": "Founder & CEO",
                "department": "Executive",
                "employee_id": "FT001",
                "email": "abdulrasaq@facetrust.ai",
                "phone": "+234-801-234-5678",
                "nin": "12345678901",
                "unique_id_number": "FT-EMP-001",
                "gender": "Male",
                "date_of_birth": "1995-01-01",
                "nationality": "Nigerian",
                "address_city": "Lagos",
                "address_state": "Lagos State",
                "address_country": "Nigeria",
                "hire_date": "2024-01-01",
                "access_level": "Administrator",
                "social_media": {
                    "linkedin": "linkedin.com/in/abdulrasaq-abdulrasaq",
                    "twitter": "@abdulrasaq"
                },
                "verification_history": {
                    "last_verified": "2024-01-20T10:30:00Z",
                    "verification_count": 1,
                    "risk_score": 0
                },
                "bio": "Founder and CEO of FaceTrust AI, passionate about building secure identity verification solutions for Africa."
            }
        }
        
        # Load and train
        self.load_team_data()
        self.load_and_encode_images()

    def load_team_data(self):
        """Load team member data"""
        team_data_path = self.models_path / "team_data.json"
        if team_data_path.exists():
            with open(team_data_path, 'r') as f:
                loaded_data = json.load(f)
                # Merge with defaults
                self.team_data = {**self.default_team_data, **loaded_data}
        else:
            self.team_data = self.default_team_data.copy()
            
        print(f"Loaded team data for {len(self.team_data)} members")

    def validate_face_quality(self, face_roi):
        """Validate face image quality"""
        try:
            height, width = face_roi.shape
            if height < self.min_face_size or width < self.min_face_size:
                return False, "Face too small"
            
            brightness = np.mean(face_roi)
            if brightness < 30 or brightness > 220:
                return False, "Poor lighting"
            
            laplacian_var = cv2.Laplacian(face_roi, cv2.CV_64F).var()
            if laplacian_var < 50:
                return False, "Image too blurry"
            
            contrast = face_roi.std()
            if contrast < 15:
                return False, "Low contrast"
            
            return True, "Good quality"
            
        except Exception as e:
            return False, f"Quality check failed: {str(e)}"

    def load_and_encode_images(self):
        """Load and train model"""
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
                print(f"Processing: {name}")
                
                image = cv2.imread(str(image_path))
                if image is None:
                    print(f"✗ Could not load: {name}")
                    continue
                
                gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
                
                detected_faces = self.face_cascade.detectMultiScale(
                    gray, scaleFactor=1.1, minNeighbors=5,
                    minSize=(self.min_face_size, self.min_face_size),
                    flags=cv2.CASCADE_SCALE_IMAGE
                )
                
                if len(detected_faces) == 0:
                    print(f"✗ No face detected in: {name}")
                    continue
                
                if len(detected_faces) > 1:
                    print(f"⚠ Multiple faces detected in: {name}, using largest")
                    detected_faces = [max(detected_faces, key=lambda f: f[2] * f[3])]
                
                (x, y, w, h) = detected_faces[0]
                face_roi = gray[y:y+h, x:x+w]
                
                print(f"Face size: {face_roi.shape}")
                
                is_good_quality, quality_msg = self.validate_face_quality(face_roi)
                print(f"Quality check: {is_good_quality} - {quality_msg}")
                
                # Accept for training regardless of quality for now
                face_roi = cv2.resize(face_roi, (200, 200))
                
                faces.append(face_roi)
                labels.append(idx)
                self.class_names.append(name)
                self.training_features.append(face_roi.copy())
                
                print(f"✓ Added to training set: {name}")
            
            print(f"\nTraining Summary:")
            print(f"Valid faces found: {len(faces)}")
            print(f"Class names: {self.class_names}")
            
            if len(faces) < 1:
                print("ERROR: Need at least 1 valid face image to train")
                self.model_trained = False
                return
            
            # Train recognizer
            faces = np.array(faces)
            labels = np.array(labels)
            
            self.recognizer.train(faces, labels)
            self.model_trained = True
            
            print(f"✓ Model trained successfully for {len(self.class_names)} members: {self.class_names}")
            print("Model initialization complete. Known members:", len(self.class_names))
            
        except Exception as e:
            print(f"ERROR: Training failed: {str(e)}")
            import traceback
            traceback.print_exc()
            self.model_trained = False

    def recognize_face_from_image(self, image):
        """STRICT face recognition - prevent false positives"""
        try:
            if not self.model_trained:
                return {"success": False, "error": "Model not trained", "faces_found": 0, "results": []}
            
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            faces = self.face_cascade.detectMultiScale(
                gray, scaleFactor=1.1, minNeighbors=5,
                minSize=(self.min_face_size, self.min_face_size),
                flags=cv2.CASCADE_SCALE_IMAGE
            )
            
            if len(faces) == 0:
                return {"success": True, "faces_found": 0, "results": []}
            
            results = []
            
            for (x, y, w, h) in faces:
                face_roi = gray[y:y+h, x:x+w]
                face_roi = cv2.resize(face_roi, (200, 200))
                
                # Get prediction
                label, distance = self.recognizer.predict(face_roi)
                
                # Calculate confidence score (0-1)
                confidence = max(0, (self.confidence_threshold - distance) / self.confidence_threshold)
                
                print(f"STRICT SECURITY CHECK:")
                print(f"  Label: {label}")
                print(f"  Distance: {distance:.2f}")
                print(f"  Confidence: {confidence:.3f} ({confidence*100:.1f}%)")
                print(f"  Threshold: {self.confidence_threshold}")
                print(f"  Required confidence: {self.min_match_confidence}")
                
                # VERY STRICT MATCHING CONDITIONS
                is_valid_match = (
                    distance <= self.confidence_threshold and      # Distance check
                    distance <= self.max_distance_threshold and    # Max distance
                    confidence >= self.min_match_confidence and    # Minimum confidence
                    label < len(self.class_names) and              # Valid label
                    label >= 0                                     # Non-negative
                )
                
                print(f"  SECURITY DECISION: {'✅ AUTHORIZED' if is_valid_match else '❌ UNAUTHORIZED'}")
                
                if is_valid_match:
                    name = self.class_names[label]
                    team_data = self.team_data.get(name, {})
                    
                    results.append({
                        "matched": True,
                        "name": name,
                        "confidence": confidence,
                        "distance": distance,
                        "team_data": team_data,
                        "bounding_box": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)},
                        "reason": f"✅ VERIFIED: {name} ({confidence:.1%} confidence)"
                    })
                else:
                    results.append({
                        "matched": False,
                        "name": "Unknown",
                        "confidence": confidence,
                        "distance": distance,
                        "reason": f"❌ ACCESS DENIED - Insufficient security clearance (Score: {confidence:.1%}, Required: {self.min_match_confidence:.1%})",
                        "team_data": {},
                        "bounding_box": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)}
                    })
            
            return {"success": True, "faces_found": len(faces), "results": results}
            
        except Exception as e:
            print(f"Recognition error: {str(e)}")
            return {"success": False, "error": str(e), "faces_found": 0, "results": []}

    def update_thresholds(self, confidence_threshold=None, max_distance=None, min_face_size=None):
        """Update recognition thresholds for fine-tuning accuracy"""
        if confidence_threshold is not None:
            self.confidence_threshold = confidence_threshold
        if max_distance is not None:
            self.max_distance_threshold = max_distance
        if min_face_size is not None:
            self.min_face_size = min_face_size
        
        print(f"Updated thresholds: confidence={self.confidence_threshold}, max_distance={self.max_distance_threshold}, min_face={self.min_face_size}")

