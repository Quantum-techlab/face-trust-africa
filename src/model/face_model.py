import cv2
import os
import numpy as np
import json
from pathlib import Path

class FaceRecognitionModel:
    def __init__(self, models_path="Models"):
        self.models_path = Path(models_path)
        
        # RELAXED THRESHOLDS for better compatibility
        self.confidence_threshold = 100.0  # More lenient LBPH threshold
        self.min_face_size = 50           # Smaller minimum face size
        self.max_distance_threshold = 120  # Higher distance allowed
        
        # Face detection and recognition
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.recognizer = cv2.face.LBPHFaceRecognizer_create()
        
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
            print("No team data file found")

    def validate_face_quality(self, face_roi):
        """RELAXED validation for face image quality"""
        try:
            # Check face size
            height, width = face_roi.shape
            if height < self.min_face_size or width < self.min_face_size:
                return False, "Face too small"
            
            # RELAXED brightness check
            brightness = np.mean(face_roi)
            if brightness < 20 or brightness > 235:  # Was 50-200, now more lenient
                return False, "Extreme lighting conditions"
            
            # RELAXED sharpness check (blur detection)
            laplacian_var = cv2.Laplacian(face_roi, cv2.CV_64F).var()
            if laplacian_var < 30:  # Was 100, now much more lenient
                return False, "Image too blurry"
            
            # RELAXED contrast check
            contrast = face_roi.std()
            if contrast < 10:  # Was 20, now more lenient
                return False, "Low contrast image"
            
            return True, "Good quality"
            
        except Exception as e:
            return False, f"Quality check failed: {str(e)}"

    def load_and_encode_images(self):
        """Load and train model with RELAXED validation"""
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
                
                # RELAXED face detection parameters
                detected_faces = self.face_cascade.detectMultiScale(
                    gray,
                    scaleFactor=1.1,     # Standard parameter
                    minNeighbors=3,      # More lenient (was 6)
                    minSize=(self.min_face_size, self.min_face_size),
                    flags=cv2.CASCADE_SCALE_IMAGE
                )
                
                if len(detected_faces) == 0:
                    print(f"✗ No face detected in: {name}")
                    continue
                
                if len(detected_faces) > 1:
                    print(f"⚠ Multiple faces detected in: {name}, using largest")
                    detected_faces = [max(detected_faces, key=lambda f: f[2] * f[3])]
                
                # Extract and validate face
                (x, y, w, h) = detected_faces[0]
                face_roi = gray[y:y+h, x:x+w]
                
                print(f"Face size: {face_roi.shape}")
                
                # Quality validation with detailed logging
                is_good_quality, quality_msg = self.validate_face_quality(face_roi)
                print(f"Quality check: {is_good_quality} - {quality_msg}")
                
                if not is_good_quality:
                    print(f"⚠ Quality issue ({quality_msg}): {name} - ACCEPTING ANYWAY")
                    # Accept anyway for training - we need the faces!
                
                # Standardize face size
                face_roi = cv2.resize(face_roi, (200, 200))
                
                # Store training data
                faces.append(face_roi)
                labels.append(idx)
                self.class_names.append(name)
                self.training_features.append(face_roi.copy())
                
                print(f"✓ Added to training set: {name}")
            
            print(f"\nTraining Summary:")
            print(f"Valid faces found: {len(faces)}")
            print(f"Class names: {self.class_names}")
            
            # ALLOW TRAINING WITH JUST 1 FACE
            if len(faces) < 1:
                print("ERROR: Need at least 1 valid face image to train")
                self.model_trained = False
                return
            elif len(faces) == 1:
                print("⚠ Training with only 1 face - recognition will be limited")
            
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
        """Face recognition with relaxed thresholds"""
        try:
            if not self.model_trained:
                return {
                    "success": False,
                    "error": "Model not trained",
                    "faces_found": 0,
                    "results": []
                }
            
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Face detection with same relaxed parameters as training
            faces = self.face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=3,
                minSize=(self.min_face_size, self.min_face_size),
                flags=cv2.CASCADE_SCALE_IMAGE
            )
            
            if len(faces) == 0:
                return {
                    "success": True,
                    "faces_found": 0,
                    "results": [],
                    "message": "No faces detected in image"
                }
            
            results = []
            
            for (x, y, w, h) in faces:
                face_roi = gray[y:y+h, x:x+w]
                face_roi = cv2.resize(face_roi, (200, 200))
                
                # Get prediction
                label, distance = self.recognizer.predict(face_roi)
                
                print(f"Recognition: label={label}, distance={distance}, threshold={self.confidence_threshold}")
                
                # Check if it's a valid match
                is_match = (
                    distance <= self.confidence_threshold and
                    label < len(self.class_names) and
                    label >= 0
                )
                
                # Calculate confidence score (0-1)
                confidence = max(0, min(1, (self.confidence_threshold - distance) / self.confidence_threshold))
                
                if is_match:
                    name = self.class_names[label]
                    team_data = self.team_data.get(name, {})
                    
                    results.append({
                        "matched": True,
                        "name": name,
                        "confidence": confidence,
                        "distance": distance,
                        "team_data": team_data,
                        "bounding_box": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)},
                        "reason": f"Verified team member: {name}"
                    })
                else:
                    results.append({
                        "matched": False,
                        "name": "Unknown",
                        "confidence": confidence,
                        "distance": distance,
                        "reason": f"Not a recognized team member (distance: {distance:.1f})",
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

