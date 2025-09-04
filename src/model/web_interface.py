from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import sys
import os
import base64
import numpy as np
import cv2
import json

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from face_model import FaceRecognitionModel

app = Flask(__name__)
CORS(app, origins=["*"])  # Allow all origins for testing

# Initialize face recognition model
face_model = FaceRecognitionModel()

@app.route('/')
def home():
    return jsonify({
        "message": "FaceTrust AI Face Recognition API",
        "version": "1.0.0",
        "endpoints": {
            "/recognize": "POST - Recognize face from base64 image",
            "/team": "GET - Get team member data",
            "/health": "GET - Health check"
        }
    })

@app.route('/health')
def health():
    try:
        model_loaded = hasattr(face_model, 'model_trained') and face_model.model_trained and len(face_model.class_names) > 0
        return jsonify({
            "status": "healthy",
            "model_loaded": model_loaded,
            "model_trained": getattr(face_model, 'model_trained', False),
            "known_faces": len(face_model.class_names),
            "team_members": list(face_model.class_names),
            "models_path": str(face_model.models_path),  # Convert to string
            "server_running": True
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e),
            "server_running": True,
            "model_loaded": False
        }), 500

@app.route('/team')
def get_team():
    try:
        return jsonify({
            "team_members": face_model.class_names,
            "total_members": len(face_model.class_names),
            "status": "success"
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "team_members": [],
            "total_members": 0,
            "status": "error"
        }), 500

@app.route('/recognize', methods=['POST', 'OPTIONS'])
def recognize_face():
    if request.method == 'OPTIONS':
        return '', 200
    
    print("=== RECOGNIZE ENDPOINT CALLED ===")
    print(f"Request method: {request.method}")
    print(f"Content-Type: {request.headers.get('Content-Type')}")
    
    try:
        # Check if model is trained
        if not getattr(face_model, 'model_trained', False) or len(face_model.class_names) == 0:
            return jsonify({
                "matched": False,
                "confidence": 0.0,
                "reason": "Face recognition model not trained or no known faces available",
                "identity": None,
                "model_trained": getattr(face_model, 'model_trained', False),
                "known_faces": len(face_model.class_names)
            })
        
        data = request.get_json()
        
        if 'image' not in data:
            return jsonify({
                "matched": False,
                "confidence": 0.0,
                "reason": "No image data provided",
                "identity": None
            }), 400
        
        # Decode base64 image
        image_data = data['image']
        if image_data.startswith('data:image'):
            # Remove data URL prefix
            image_data = image_data.split(',')[1]
        
        # Convert base64 to numpy array
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({
                "matched": False,
                "confidence": 0.0,
                "reason": "Could not decode image",
                "identity": None
            }), 400
        
        # Recognize face
        result = face_model.recognize_face_from_image(img)
        
        print(f"Recognition result: {result}")
        
        # Format response for frontend
        if result.get("success") and result.get("faces_found", 0) > 0:
            face_result = result["results"][0]  # Take first face
            
            if face_result["matched"]:
                team_data = face_result.get("team_data", {})
                
                # Format response to match existing VerificationResponse interface
                response = {
                    "matched": True,
                    "confidence": face_result["confidence"],
                    "liveness": 0.95,  # Assume high liveness for team members
                    "identity": {
                        "full_name": team_data.get("full_name", face_result["name"]),
                        "name": face_result["name"],
                        "role": team_data.get("role", "Team Member"),
                        "department": team_data.get("department", ""),
                    },
                    "reason": f"Verified team member: {face_result['name']}",
                    "processing_time": 800
                }
            else:
                response = {
                    "matched": False,
                    "confidence": face_result["confidence"],
                    "liveness": 0.75,
                    "identity": None,
                    "reason": face_result.get("reason", "Face not recognized as team member"),
                    "processing_time": 800
                }
        else:
            response = {
                "matched": False,
                "confidence": 0.0,
                "liveness": 0.60,
                "identity": None,
                "reason": result.get("error", "No face detected in image"),
                "processing_time": 500
            }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Recognition error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "matched": False,
            "confidence": 0.0,
            "reason": f"Recognition failed: {str(e)}",
            "identity": None
        }), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)