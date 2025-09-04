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
    model_loaded = hasattr(face_model, 'model_trained') and face_model.model_trained and len(face_model.class_names) > 0
    return jsonify({
        "status": "healthy",
        "model_loaded": model_loaded,
        "model_trained": getattr(face_model, 'model_trained', False),
        "known_faces": len(face_model.class_names),
        "team_members": list(face_model.class_names),
        "models_path": face_model.models_path,
        "server_running": True
    })

@app.route('/team')
def get_team():
    return jsonify({
        "team_members": face_model.class_names,
        "team_data": face_model.team_data
    })

@app.route('/recognize', methods=['POST', 'OPTIONS'])
def recognize_face():
    if request.method == 'OPTIONS':
        return '', 200
    
    print("=== STRICT FACE RECOGNITION STARTED ===")
    
    try:
        if not getattr(face_model, 'model_trained', False):
            return jsonify({
                "matched": False,
                "confidence": 0.0,
                "reason": "Face recognition system not initialized",
                "identity": None,
                "system_status": "Model not trained"
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
        except Exception as e:
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
                "reason": "Could not decode image data",
                "identity": None
            }), 400
        
        # Recognize with strict validation
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
                "liveness": 0.1,  # Very low liveness if no face
                "reason": "No face detected in image",
                "identity": None,
                "processing_time": 300
            })
        
        # Process first face result
        face_result = result["results"][0]
        
        if face_result["matched"]:
            # VERIFIED TEAM MEMBER
            team_data = face_result["team_data"]
            confidence_percentage = round(face_result["confidence"] * 100, 1)
            
            response = {
                "matched": True,
                "confidence": face_result["confidence"],
                "confidence_percentage": confidence_percentage,
                "liveness": 0.95,  # High liveness for verified members
                "identity": {
                    "full_name": team_data.get("full_name", face_result["name"]),
                    "name": face_result["name"],
                    "role": team_data.get("role", "Team Member"),
                    "department": team_data.get("department", ""),
                    "employee_id": team_data.get("employee_id", ""),
                    "verification_level": "VERIFIED",
                    "match_quality": "HIGH" if face_result["confidence"] > 0.8 else "MEDIUM"
                },
                "reason": f"✓ Verified team member: {face_result['name']} ({confidence_percentage}% match)",
                "processing_time": 850,
                "technical_details": {
                    "distance": face_result.get("distance", 0),
                    "similarity": face_result.get("similarity", 0),
                    "algorithm": "LBPH"
                }
            }
        else:
            # NOT A TEAM MEMBER
            confidence_percentage = round(face_result["confidence"] * 100, 1) if face_result["confidence"] else 0
            
            response = {
                "matched": False,
                "confidence": face_result["confidence"],
                "confidence_percentage": confidence_percentage,
                "liveness": 0.75,  # Medium liveness for detected but unrecognized faces
                "identity": None,
                "reason": f"✗ {face_result.get('reason', 'Person not in authorized database')}",
                "processing_time": 650,
                "security_note": "Access denied - unauthorized individual",
                "technical_details": {
                    "distance": face_result.get("distance", 999),
                    "faces_detected": result.get("faces_found", 0),
                    "algorithm": "LBPH"
                }
            }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"RECOGNITION ERROR: {str(e)}")
        return jsonify({
            "matched": False,
            "confidence": 0.0,
            "reason": "System error during recognition",
            "identity": None,
            "error_details": str(e) if app.debug else "Contact administrator"
        }), 500

@app.route('/upload_team_member', methods=['POST'])
def upload_team_member():
    """Upload a new team member image and data"""
    try:
        data = request.get_json()
        
        if 'name' not in data or 'image' not in data:
            return jsonify({"error": "Name and image are required"}), 400
        
        name = data['name'].replace(' ', '_')  # Replace spaces with underscores
        image_data = data['image']
        team_data = data.get('team_data', {})
        
        # Decode and save image
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
        
        image_bytes = base64.b64decode(image_data)
        
        # Save image to Models folder
        image_path = os.path.join(face_model.models_path, f"{name}.jpg")
        with open(image_path, 'wb') as f:
            f.write(image_bytes)
        
        # Update team data
        face_model.team_data[name] = team_data
        
        # Save updated team data
        with open(os.path.join(face_model.models_path, 'team_data.json'), 'w') as f:
            json.dump(face_model.team_data, f, indent=2)
        
        # Reload model with new data
        face_model.load_and_encode_images()
        
        return jsonify({
            "success": True,
            "message": f"Team member {name} added successfully",
            "total_members": len(face_model.class_names)
        })
        
    except Exception as e:
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500

@app.route('/system/thresholds', methods=['POST'])
def update_thresholds():
    """Update recognition thresholds for fine-tuning"""
    try:
        data = request.get_json()
        
        confidence_threshold = data.get('confidence_threshold')
        max_distance = data.get('max_distance')
        min_face_size = data.get('min_face_size')
        
        face_model.update_thresholds(confidence_threshold, max_distance, min_face_size)
        
        return jsonify({
            "success": True,
            "message": "Thresholds updated successfully",
            "current_thresholds": {
                "confidence_threshold": face_model.confidence_threshold,
                "max_distance_threshold": face_model.max_distance_threshold,
                "min_face_size": face_model.min_face_size
            }
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)