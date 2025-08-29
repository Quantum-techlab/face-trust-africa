#!/usr/bin/env python3
"""
Test script to diagnose backend issues
"""
import sys
import os
import traceback

print("=== FaceTrust AI Backend Diagnosis ===")
print(f"Python version: {sys.version}")
print(f"Python executable: {sys.executable}")
print(f"Current working directory: {os.getcwd()}")
print()

# Test imports
try:
    import cv2
    print(f"✓ OpenCV imported successfully - version: {cv2.__version__}")
except Exception as e:
    print(f"✗ OpenCV import failed: {e}")

try:
    import numpy as np
    print(f"✓ NumPy imported successfully - version: {np.__version__}")
except Exception as e:
    print(f"✗ NumPy import failed: {e}")

try:
    import flask
    print(f"✓ Flask imported successfully - version: {flask.__version__}")
except Exception as e:
    print(f"✗ Flask import failed: {e}")

try:
    from flask_cors import CORS
    print("✓ Flask-CORS imported successfully")
except Exception as e:
    print(f"✗ Flask-CORS import failed: {e}")

print()

# Test Models directory
models_path = os.path.join(os.path.dirname(__file__), "src", "model", "Models")
print(f"Models path: {models_path}")
print(f"Models directory exists: {os.path.exists(models_path)}")

if os.path.exists(models_path):
    files = os.listdir(models_path)
    image_files = [f for f in files if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    print(f"Files in Models directory: {files}")
    print(f"Image files found: {image_files}")
else:
    print("✗ Models directory not found!")

print()

# Test face_model import
try:
    sys.path.append(os.path.join(os.path.dirname(__file__), "src", "model"))
    from face_model import FaceRecognitionModel
    print("✓ FaceRecognitionModel imported successfully")
    
    # Test model initialization
    print("Initializing model...")
    model = FaceRecognitionModel()
    print(f"Model trained: {model.model_trained}")
    print(f"Known members: {model.class_names}")
    print(f"Team data loaded: {len(model.team_data)} entries")
    
except Exception as e:
    print(f"✗ FaceRecognitionModel failed: {e}")
    traceback.print_exc()

print()

# Test web_interface import
try:
    from web_interface import app
    print("✓ Flask app imported successfully")
    
    # Test health endpoint
    with app.test_client() as client:
        response = client.get('/health')
        print(f"Health endpoint status: {response.status_code}")
        if response.status_code == 200:
            data = response.get_json()
            print(f"Health response: {data}")
        else:
            print(f"Health endpoint failed: {response.data}")
            
except Exception as e:
    print(f"✗ Web interface test failed: {e}")
    traceback.print_exc()

print("\n=== Diagnosis Complete ===")
