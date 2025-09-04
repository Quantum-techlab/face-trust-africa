import cv2
import os
import numpy as np
import json
from pathlib import Path
import imutils

class FaceRecognitionModel:
    def __init__(self, models_path="Models"):
        self.models_path = Path(models_path)
        
        # STRICT THRESHOLDS - Adjust these for accuracy vs false positives
        self.confidence_threshold = 50.0  # LBPH: Lower = stricter (0-150 range)
        self.min_face_size = 80           # Minimum face size in pixels
        self.max_distance_threshold = 80  # Maximum allowed distance for match
        
        # Face detection and recognition
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        self.recognizer = cv2.face.LBPHFaceRecognizer_create()
        
        # Training data
        self.class_names = []
        self.team_data = {}
        self.model_trained = False
        self.training_features = []  # Store training face features for validation
        
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

    def validate_face_quality(self, face_roi):
        """Validate if face image quality is good enough for recognition"""
        try:
            # Check face size
            height, width = face_roi.shape
            if height < self.min_face_size or width < self.min_face_size:
                return False, "Face too small"
            
            # Check image brightness
            brightness = np.mean(face_roi)
            if brightness < 50 or brightness > 200:
                return False, "Poor lighting conditions"
            
            # Check image sharpness (using Laplacian variance)
            laplacian_var = cv2.Laplacian(face_roi, cv2.CV_64F).var()
            if laplacian_var < 100:  # Threshold for blur detection
                return False, "Image too blurry"
            
            # Check contrast
            contrast = face_roi.std()
            if contrast < 20:
                return False, "Low contrast image"
            
            return True, "Good quality"
            
        except Exception as e:
            return False, f"Quality check failed: {str(e)}"

    def load_and_encode_images(self):
        """Load and train model with STRICT validation"""
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
                
                # Detect faces with strict parameters
                detected_faces = self.face_cascade.detectMultiScale(
                    gray,
                    scaleFactor=1.05,  # More strict
                    minNeighbors=6,    # More strict
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
                
                # Quality validation
                is_good_quality, quality_msg = self.validate_face_quality(face_roi)
                if not is_good_quality:
                    print(f"✗ Poor quality ({quality_msg}): {name}")
                    continue
                
                # Standardize face size
                face_roi = cv2.resize(face_roi, (200, 200))
                
                # Store training data
                faces.append(face_roi)
                labels.append(idx)
                self.class_names.append(name)
                self.training_features.append(face_roi.copy())
                
                print(f"✓ Added to training set: {name}")
            
            if len(faces) < 2:
                print("ERROR: Need at least 2 valid face images to train")
                return
            
            # Train recognizer
            faces = np.array(faces)
            labels = np.array(labels)
            
            self.recognizer.train(faces, labels)
            self.model_trained = True
            
            print(f"✓ Model trained with {len(self.class_names)} members: {self.class_names}")
            print(f"✓ Confidence threshold: {self.confidence_threshold}")
            
        except Exception as e:
            print(f"ERROR: Training failed: {str(e)}")

    def recognize_face_from_image(self, image):
        """STRICT face recognition - only matches trained individuals"""
        try:
            if not self.model_trained:
                return {
                    "success": False,
                    "error": "Model not trained",
                    "faces_found": 0,
                    "results": []
                }
            
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            
            # Detect faces with same strict parameters as training
            faces = self.face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.05,
                minNeighbors=6,
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
                
                # Quality validation
                is_good_quality, quality_msg = self.validate_face_quality(face_roi)
                if not is_good_quality:
                    results.append({
                        "matched": False,
                        "name": "Unknown",
                        "confidence": 0.0,
                        "reason": f"Poor image quality: {quality_msg}",
                        "team_data": {},
                        "bounding_box": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)}
                    })
                    continue
                
                # Resize for recognition
                face_roi = cv2.resize(face_roi, (200, 200))
                
                # Get prediction
                label, distance = self.recognizer.predict(face_roi)
                
                print(f"Recognition: label={label}, distance={distance}, threshold={self.confidence_threshold}")
                
                # STRICT MATCHING CONDITIONS
                is_valid_match = (
                    distance <= self.confidence_threshold and  # Distance threshold
                    distance <= self.max_distance_threshold and  # Max distance allowed
                    label < len(self.class_names) and  # Valid label
                    label >= 0  # Non-negative label
                )
                
                if is_valid_match:
                    name = self.class_names[label]
                    
                    # Calculate confidence (inverse of distance, normalized)
                    confidence = max(0, (self.max_distance_threshold - distance) / self.max_distance_threshold)
                    
                    # Additional validation: Compare with training features
                    training_face = self.training_features[label]
                    similarity = cv2.compareHist(
                        cv2.calcHist([face_roi], [0], None, [256], [0, 256]),
                        cv2.calcHist([training_face], [0], None, [256], [0, 256]),
                        cv2.HISTCMP_CORREL
                    )
                    
                    # Require both distance AND histogram similarity
                    if similarity < 0.7:  # Histogram correlation threshold
                        results.append({
                            "matched": False,
                            "name": "Unknown",
                            "confidence": confidence,
                            "distance": distance,
                            "similarity": similarity,
                            "reason": f"Insufficient similarity to known faces (sim: {similarity:.3f})",
                            "team_data": {},
                            "bounding_box": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)}
                        })
                        continue
                    
                    # VALID MATCH FOUND
                    team_data = self.team_data.get(name, {})
                    results.append({
                        "matched": True,
                        "name": name,
                        "confidence": confidence,
                        "distance": distance,
                        "similarity": similarity,
                        "team_data": team_data,
                        "bounding_box": {"x": int(x), "y": int(y), "width": int(w), "height": int(h)},
                        "reason": f"Verified team member (confidence: {confidence:.3f})"
                    })
                    
                else:
                    # NO MATCH - Unknown person
                    confidence = max(0, (self.max_distance_threshold - distance) / self.max_distance_threshold)
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

