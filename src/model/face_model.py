import cv2
from typing import List, Tuple
import numpy as np
import os
import imutils
import json
from datetime import datetime

class FaceRecognitionModel:
    def __init__(self, models_path=None):
        # Resolve Models directory relative to this file to avoid CWD issues
        self.models_path = models_path or os.path.join(os.path.dirname(__file__), "Models")
        self.images = []
        self.class_names = []
        self.encode_list_known = []
        self.team_data = {}
        self.load_team_data()
        self.load_and_encode_images()
    
    def load_team_data(self):
        """Load team member data from JSON file"""
        try:
            with open(os.path.join(self.models_path, 'team_data.json'), 'r') as f:
                self.team_data = json.load(f)
        except FileNotFoundError:
            print("Team data file not found. Using default data.")
            self.team_data = {}
    
    def load_and_encode_images(self):
        """Load images from Models folder and encode them"""
        # Reset state before (re)loading to avoid duplicates
        self.images = []
        self.class_names = []
        self.encode_list_known = []

        if not os.path.exists(self.models_path):
            print(f"Models folder '{self.models_path}' not found!")
            return
            
        mylist = os.listdir(self.models_path)
        image_files = [f for f in mylist if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        
        for cls in image_files:
            try:
                curnt_img = cv2.imread(f'{self.models_path}/{cls}')
                if curnt_img is not None:
                    self.images.append(curnt_img)
                    # Remove file extension to get the name
                    name = os.path.splitext(cls)[0]
                    self.class_names.append(name)
                    print(f"Loaded image for: {name}")
                else:
                    print(f"Could not load image: {cls}")
            except Exception as e:
                print(f"Error loading {cls}: {e}")
        
        # Encode all loaded images and filter to only valid encodings
        # Train LBPH face recognizer with grayscale faces
        self.train_lbph(self.images, self.class_names)
        print(f"Trained recognizer for members: {self.class_names}")
    
    def detect_largest_face(self, gray: np.ndarray) -> Tuple[int, int, int, int] | None:
        # Enhance contrast for better detection
        try:
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            gray = clahe.apply(gray)
        except Exception:
            pass

        cascade_paths = [
            'haarcascade_frontalface_default.xml',
            'haarcascade_frontalface_alt2.xml',
        ]
        faces_all = []
        for cascade_name in cascade_paths:
            cascade = cv2.CascadeClassifier(cv2.data.haarcascades + cascade_name)
            if cascade.empty():
                continue
            for scale in (1.1, 1.05):
                faces = cascade.detectMultiScale(gray, scaleFactor=scale, minNeighbors=5, minSize=(60, 60))
                if len(faces) > 0:
                    faces_all.extend(list(faces))
        if len(faces_all) == 0:
            return None
        x, y, w, h = sorted(faces_all, key=lambda f: f[2] * f[3], reverse=True)[0]
        return (x, y, w, h)

    def train_lbph(self, images: List[np.ndarray], names: List[str]) -> None:
        self.recognizer = cv2.face.LBPHFaceRecognizer_create(radius=2, neighbors=16, grid_x=8, grid_y=8)
        gray_samples = []
        labels = []
        filtered_names: List[str] = []
        for img, name in zip(images, names):
            try:
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                face = self.detect_largest_face(gray)
                if face is None:
                    print(f"No face detected for: {name}")
                    continue
                x, y, w, h = face
                roi = gray[y:y+h, x:x+w]
                roi_resized = cv2.resize(roi, (200, 200))
                gray_samples.append(roi_resized)
                labels.append(len(filtered_names))
                filtered_names.append(name)
                print(f"Prepared LBPH sample for: {name}")
            except Exception as e:
                print(f"Error preparing sample for {name}: {e}")
        if len(gray_samples) == 0:
            # Fallback: use centered crop as a last resort so MVP still works
            for img, name in zip(images, names):
                try:
                    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                    h, w = gray.shape[:2]
                    side = int(min(h, w) * 0.6)
                    cx, cy = w // 2, h // 2
                    x = max(0, cx - side // 2)
                    y = max(0, cy - side // 2)
                    roi = gray[y:y + side, x:x + side]
                    if roi.size == 0:
                        continue
                    roi_resized = cv2.resize(roi, (200, 200))
                    gray_samples.append(roi_resized)
                    labels.append(len(filtered_names))
                    filtered_names.append(name)
                    print(f"Fallback center-crop sample used for: {name}")
                except Exception as e:
                    print(f"Fallback sample error for {name}: {e}")
        if len(gray_samples) == 0:
            print("No valid samples found to train recognizer")
            self.class_names = []
            return
        self.recognizer.train(gray_samples, np.array(labels))
        self.class_names = filtered_names
    
    def recognize_face_from_image(self, image_path_or_array):
        """Recognize face from image file or numpy array"""
        try:
            # Handle both file path and numpy array input
            if isinstance(image_path_or_array, str):
                img = cv2.imread(image_path_or_array)
            else:
                img = image_path_or_array
            
            if img is None:
                return {"error": "Could not load image"}
            
            # Convert to grayscale and detect faces
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = []
            # Try detection, otherwise fallback to center crop
            det = self.detect_largest_face(gray)
            if det is not None:
                faces = [det]
            else:
                h, w = gray.shape[:2]
                side = int(min(h, w) * 0.6)
                cx, cy = w // 2, h // 2
                x = max(0, cx - side // 2)
                y = max(0, cy - side // 2)
                faces = [(x, y, side, side)]

            results = []
            for (x, y, w, h) in faces:
                roi = gray[y:y+h, x:x+w]
                roi_resized = cv2.resize(roi, (200, 200))
                label, distance = self.recognizer.predict(roi_resized) if hasattr(self, 'recognizer') else (-1, 1e9)
                if 0 <= label < len(self.class_names):
                    name = self.class_names[label]
                    # Convert distance to pseudo-confidence (lower distance -> higher confidence)
                    confidence = float(max(0.0, min(1.0, 1.0 - (distance / 100.0))))
                    member_data = self.team_data.get(name, {})
                    result = {
                        "matched": True,
                        "name": name,
                        "confidence": confidence,
                        "face_location": (y, x+w, y+h, x),
                        "team_data": member_data
                    }
                else:
                    result = {
                        "matched": False,
                        "name": "UNKNOWN",
                        "confidence": 0.0,
                        "face_location": (y, x+w, y+h, x),
                        "team_data": {}
                    }
                results.append(result)
            
            return {
                "success": True,
                "faces_found": len(results),
                "results": results,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {"error": f"Recognition failed: {str(e)}"}
    
    def start_camera_recognition(self):
        """Start real-time camera recognition (for testing)"""
        cam = cv2.VideoCapture(0)
        
        while True:
            ret, img = cam.read()
            if not ret:
                break
                
            # Resize for faster processing
            imgs = cv2.resize(img, (0, 0), None, 0.33, 0.33)
            imgs = cv2.cvtColor(imgs, cv2.COLOR_BGR2RGB)
            img = imutils.resize(img, height=450, width=700)
            
            faces_cur_frame = face_recognition.face_locations(imgs)
            encode = face_recognition.face_encodings(imgs, faces_cur_frame)
            
            for encode_face, face_loc in zip(encode, faces_cur_frame):
                matches = face_recognition.compare_faces(self.encode_list_known, encode_face)
                face_dis = face_recognition.face_distance(self.encode_list_known, encode_face)
                
                if len(face_dis) > 0:
                    match_index = np.argmin(face_dis)
                    
                    if matches[match_index]:
                        name = self.class_names[match_index].upper()
                        y1, x2, y2, x1 = face_loc
                        y1, x2, y2, x1 = y1*3, x2*3, y2*3, x1*3
                        cv2.rectangle(img, (x1, y1), (x2, y2+9), (0, 255, 0), 2)
                        cv2.rectangle(img, (x1, y2-32), (x2, y2+9), (0, 255, 0), cv2.FILLED)
                        cv2.putText(img, name, (x1+5, y2+5), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)
                    else:
                        y1, x2, y2, x1 = face_loc
                        y1, x2, y2, x1 = y1*3, x2*3, y2*3, x1*3
                        cv2.rectangle(img, (x1, y1), (x2, y2), (0, 0, 255), 2)
                        cv2.rectangle(img, (x1, y2-32), (x2, y2+9), (0, 0, 255), cv2.FILLED)
                        cv2.putText(img, "UNKNOWN", (x1+6, y2+6), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 2)
            
            cv2.imshow('FaceTrust AI - Face Recognition', img)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        cam.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    model = FaceRecognitionModel()
    # model.start_camera_recognition()

