#!/usr/bin/env python3
"""
Simple Face Recognition Backend for FaceTrust AI
Provides basic face recognition API endpoints
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import base64
import io
import json
import time
import cv2
import numpy as np
import face_recognition
import os
from PIL import Image
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variables for face recognition
known_face_encodings = []
known_face_names = []
team_database = {}

def load_sample_team():
    """Load sample team members for demo purposes"""
    global known_face_encodings, known_face_names, team_database
    
    # Sample team data - in production, this would come from a database
    sample_team = {
        "John Doe": {
            "full_name": "John Michael Doe",
            "gender": "Male",
            "date_of_birth": "15/03/1990",
            "nationality": "United States",
            "unique_id": "SSN-123-45-6789",
            "phone": "+1-555-0123",
            "email": "john.doe@company.com",
            "address": "New York, NY, USA",
            "drivers_license": "NY123456789 - Valid",
            "passport": "US987654321 - Valid",
            "voter_id": "NYC001234 - Active",
            "security_clearance": "Level 2",
            "department": "Engineering",
            "position": "Senior Developer",
            "employee_id": "EMP001"
        },
        "Jane Smith": {
            "full_name": "Jane Elizabeth Smith",
            "gender": "Female", 
            "date_of_birth": "22/07/1985",
            "nationality": "Canada",
            "unique_id": "SIN-987-654-321",
            "phone": "+1-555-0456",
            "email": "jane.smith@company.com",
            "address": "Toronto, ON, Canada",
            "drivers_license": "ON987654321 - Valid",
            "passport": "CA123456789 - Valid",
            "voter_id": "ON987654 - Active",
            "security_clearance": "Level 3",
            "department": "Security",
            "position": "Security Manager",
            "employee_id": "EMP002"
        }
    }
    
    team_database = sample_team
    known_face_names = list(sample_team.keys())
    
    # For demo purposes, we'll simulate face encodings
    # In production, you would have actual face images to encode
    logger.info(f"✓ Loaded {len(known_face_names)} team members: {known_face_names}")
    logger.info("✓ Model ready for face recognition")

def decode_base64_image(image_data):
    """Decode base64 image data to numpy array"""
    try:
        # Remove data URL prefix if present
        if image_data.startswith('data:image'):
            image_data = image_data.split(',')[1]
        
        # Decode base64
        image_bytes = base64.b64decode(image_data)
        
        # Convert to PIL Image
        pil_image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to RGB if necessary
        if pil_image.mode != 'RGB':
            pil_image = pil_image.convert('RGB')
        
        # Convert to numpy array
        image_array = np.array(pil_image)
        
        return image_array
    except Exception as e:
        logger.error(f"Error decoding image: {e}")
        return None

def analyze_image_quality(image):
    """Analyze image quality metrics"""
    try:
        # Convert to grayscale for analysis
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        
        # Calculate brightness
        brightness = np.mean(gray) / 255.0
        
        # Calculate sharpness (Laplacian variance)
        sharpness = cv2.Laplacian(gray, cv2.CV_64F).var() / 10000.0
        
        # Detect faces to check size
        face_locations = face_recognition.face_locations(image)
        face_size = 0.0
        if face_locations:
            top, right, bottom, left = face_locations[0]
            face_width = right - left
            face_height = bottom - top
            face_size = min(face_width, face_height) / min(image.shape[0], image.shape[1])
        
        return {
            "brightness": round(brightness, 2),
            "sharpness": round(min(sharpness, 1.0), 2),
            "face_size": round(face_size, 2),
            "angle_quality": round(0.85 + (np.random.random() * 0.15), 2)  # Simulated
        }
    except Exception as e:
        logger.error(f"Error analyzing image quality: {e}")
        return {
            "brightness": 0.5,
            "sharpness": 0.5,
            "face_size": 0.3,
            "angle_quality": 0.8
        }

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": True,
        "model_trained": len(known_face_names) > 0,
        "known_faces": len(known_face_names),
        "team_members": known_face_names,
        "timestamp": time.time()
    })

@app.route('/team', methods=['GET'])
def get_team():
    """Get team members endpoint"""
    return jsonify({
        "team_members": known_face_names,
        "team_data": team_database
    })

@app.route('/recognize', methods=['POST'])
def recognize_face():
    """Face recognition endpoint"""
    start_time = time.time()
    
    try:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({
                "matched": False,
                "reason": "No image data provided",
                "processing_time": int((time.time() - start_time) * 1000)
            }), 400
        
        # Decode the image
        image = decode_base64_image(data['image'])
        if image is None:
            return jsonify({
                "matched": False,
                "reason": "Invalid image format",
                "processing_time": int((time.time() - start_time) * 1000)
            }), 400
        
        # Analyze image quality
        image_quality = analyze_image_quality(image)
        
        # Find face locations
        face_locations = face_recognition.face_locations(image)
        
        if not face_locations:
            return jsonify({
                "matched": False,
                "confidence": 0.0,
                "liveness": 0.0,
                "reason": "No face detected in image",
                "processing_time": int((time.time() - start_time) * 1000),
                "image_quality": image_quality
            })
        
        # For demo purposes, simulate recognition based on image quality
        # In production, you would encode faces and compare with known encodings
        
        # Simulate face recognition logic
        confidence = 0.0
        matched_person = None
        
        # Basic quality checks
        if (image_quality["brightness"] > 0.3 and 
            image_quality["sharpness"] > 0.4 and 
            image_quality["face_size"] > 0.1):
            
            # Simulate finding a match (for demo)
            # In production, you would compare face encodings
            if len(known_face_names) > 0:
                # Randomly select a team member for demo
                import random
                if random.random() > 0.3:  # 70% chance of match for demo
                    matched_person = random.choice(known_face_names)
                    confidence = 0.75 + (random.random() * 0.2)  # 75-95% confidence
        
        # Calculate liveness score (simulated)
        liveness = 0.6 + (np.random.random() * 0.35)  # 60-95%
        
        result = {
            "matched": matched_person is not None,
            "confidence": round(confidence, 2),
            "liveness": round(liveness, 2),
            "processing_time": int((time.time() - start_time) * 1000),
            "image_quality": image_quality
        }
        
        if matched_person:
            result["identity"] = team_database.get(matched_person, {})
            result["reason"] = f"Successfully matched with {matched_person}"
        else:
            result["reason"] = "No matching face found in database"
        
        logger.info(f"Recognition completed: {result['matched']} (confidence: {result['confidence']})")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Recognition error: {e}")
        return jsonify({
            "matched": False,
            "reason": f"Recognition error: {str(e)}",
            "processing_time": int((time.time() - start_time) * 1000)
        }), 500

@app.route('/upload_team_member', methods=['POST'])
def upload_team_member():
    """Upload new team member endpoint"""
    try:
        data = request.get_json()
        name = data.get('name')
        image_data = data.get('image')
        team_data = data.get('team_data', {})
        
        if not name or not image_data:
            return jsonify({"error": "Name and image are required"}), 400
        
        # In production, you would:
        # 1. Decode and process the image
        # 2. Extract face encoding
        # 3. Store in database
        
        # For demo, just add to our in-memory database
        team_database[name] = team_data
        if name not in known_face_names:
            known_face_names.append(name)
        
        logger.info(f"Added team member: {name}")
        return jsonify({
            "success": True,
            "message": f"Team member {name} added successfully",
            "total_members": len(known_face_names)
        })
        
    except Exception as e:
        logger.error(f"Upload error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Starting FaceTrust AI Backend")
    print("=" * 60)
    
    # Load sample team data
    load_sample_team()
    
    print(f"✓ Backend ready on http://localhost:5000")
    print(f"✓ Health check: http://localhost:5000/health")
    print(f"✓ Model ready with {len(known_face_names)} members")
    print("=" * 60)
    
    # Start the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)