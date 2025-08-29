#!/usr/bin/env python3
"""
Simple script to start the Face Recognition backend server
"""
import sys
import os

# Add the src directory to Python path
src_dir = os.path.join(os.path.dirname(__file__), 'src')
model_dir = os.path.join(src_dir, 'model')
sys.path.insert(0, src_dir)
sys.path.insert(0, model_dir)

# Change to the model directory so relative paths work
os.chdir(model_dir)

# Import and run the web interface
from web_interface import app

if __name__ == "__main__":
    print("=" * 50)
    print("FaceTrust AI - Face Recognition Backend")
    print("=" * 50)
    print(f"Models directory: {os.path.join(model_dir, 'Models')}")
    print("Starting server on http://localhost:5000")
    print("Press Ctrl+C to stop")
    print("=" * 50)
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)
