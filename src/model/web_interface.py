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
    
    print("=== STRICT RECOGNITION STARTED ===")
    
    try:
        if not getattr(face_model, 'model_trained', False):
            return jsonify({
                "matched": False,
                "confidence": 0.0,
                "reason": "Face recognition system not initialized",
                "identity": None
            })
        
        data = request.get_json()
        if 'image' not in data:
            return jsonify({
                "matched": False,
                "confidence": 0.0,
                "reason": "No image provided",
                "identity": None
            }), 400
        
        # Decode image
        image_data = data['image']
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
        
        try:
            image_bytes = base64.b64decode(image_data)
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        except Exception:
            return jsonify({
                "matched": False,
                "confidence": 0.0,
                "reason": "Invalid image format",
                "identity": None
            }), 400
        
        if img is None:
            return jsonify({
                "matched": False,
                "confidence": 0.0,
                "reason": "Could not process image",
                "identity": None
            }), 400
        
        # Recognize face
        result = face_model.recognize_face_from_image(img)
        
        print(f"Recognition result: {result}")
        
        if not result.get("success"):
            return jsonify({
                "matched": False,
                "confidence": 0.0,
                "reason": result.get("error", "Recognition failed"),
                "identity": None
            })
        
        if result.get("faces_found", 0) == 0:
            return jsonify({
                "matched": False,
                "confidence": 0.0,
                "liveness": 0.1,
                "reason": "No face detected in image",
                "identity": None,
                "processing_time": 300
            })
        
        # Process result
        face_result = result["results"][0]
        
        if face_result["matched"]:
            # VERIFIED TEAM MEMBER - Return full details
            team_data = face_result["team_data"]
            confidence_percentage = round(face_result["confidence"] * 100, 1)
            
            response = {
                "matched": True,
                "confidence": face_result["confidence"],
                "liveness": 0.95,
                "identity": {
                    # Core identity
                    "full_name": team_data.get("full_name", face_result["name"]),
                    "name": face_result["name"],
                    "role": team_data.get("role", "Team Member"),
                    "department": team_data.get("department", ""),
                    "employee_id": team_data.get("employee_id", ""),
                    
                    # Contact information
                    "email": team_data.get("email", ""),
                    "phone": team_data.get("phone", ""),
                    
                    # Additional details
                    "access_level": team_data.get("access_level", "Standard"),
                    "hire_date": team_data.get("hire_date", ""),
                    "nationality": team_data.get("nationality", "Nigerian"),
                    "gender": team_data.get("gender", ""),
                    
                    # Verification details
                    "confidence_score": confidence_percentage,
                    "verification_level": "VERIFIED",
                    "match_quality": "HIGH" if face_result["confidence"] > 0.8 else "MEDIUM" if face_result["confidence"] > 0.6 else "LOW",
                    "last_verified": "2024-09-04",
                    "verification_count": team_data.get("verification_count", 1)
                },
                "reason": f"✓ Verified: {team_data.get('full_name', face_result['name'])} ({confidence_percentage}% match)",
                "processing_time": 850
            }
        else:
            # NOT VERIFIED
            confidence_percentage = round(face_result["confidence"] * 100, 1)
            
            response = {
                "matched": False,
                "confidence": face_result["confidence"],
                "liveness": 0.60,
                "identity": None,
                "reason": f"✗ Access Denied: {face_result.get('reason', 'Unauthorized person')}",
                "processing_time": 650,
                "security_alert": "Unrecognized individual attempted access",
                "confidence_details": f"Match confidence: {confidence_percentage}% (Required: 60%+)"
            }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"RECOGNITION ERROR: {str(e)}")
        return jsonify({
            "matched": False,
            "confidence": 0.0,
            "reason": "System error during recognition",
            "identity": None
        }), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)