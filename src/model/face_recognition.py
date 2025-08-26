import cv2
import face_recognition
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
        
        # Encode all loaded images
        self.encode_list_known = self.encode_images(self.images)
        print(f"Encoded {len(self.encode_list_known)} faces")
    
    def encode_images(self, images):
        """Encode face images for recognition"""
        encode_list = []
        for i, img in enumerate(images):
            try:
                img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                face_encodings = face_recognition.face_encodings(img_rgb)
                
                if len(face_encodings) > 0:
                    encode = face_encodings[0]  # Take the first face found
                    encode_list.append(encode)
                    print(f"Successfully encoded face for: {self.class_names[i]}")
                else:
                    print(f"No face found in image for: {self.class_names[i]}")
                    # Remove from class_names if no face found
                    self.class_names.pop(i)
            except Exception as e:
                print(f"Error encoding face for {self.class_names[i]}: {e}")
        
        return encode_list
    
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
            
            # Convert to RGB
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            
            # Find faces in the image
            face_locations = face_recognition.face_locations(img_rgb)
            face_encodings = face_recognition.face_encodings(img_rgb, face_locations)
            
            results = []
            
            for face_encoding, face_location in zip(face_encodings, face_locations):
                # Compare with known faces
                matches = face_recognition.compare_faces(self.encode_list_known, face_encoding)
                face_distances = face_recognition.face_distance(self.encode_list_known, face_encoding)
                
                if len(face_distances) > 0:
                    best_match_index = np.argmin(face_distances)
                    
                    if matches[best_match_index]:
                        name = self.class_names[best_match_index]
                        confidence = 1 - face_distances[best_match_index]  # Convert distance to confidence
                        
                        # Get team member data
                        member_data = self.team_data.get(name, {})
                        
                        result = {
                            "matched": True,
                            "name": name,
                            "confidence": float(confidence),
                            "face_location": face_location,
                            "team_data": member_data
                        }
                    else:
                        result = {
                            "matched": False,
                            "name": "UNKNOWN",
                            "confidence": 0.0,
                            "face_location": face_location,
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

# Example usage and testing
if __name__ == "__main__":
    # Initialize the face recognition model
    model = FaceRecognitionModel()
    
    # Test with camera (uncomment to test)
    # model.start_camera_recognition()
    
    # Test with image file
    # result = model.recognize_face_from_image("test_image.jpg")
    # print(json.dumps(result, indent=2))