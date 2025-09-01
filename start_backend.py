#!/usr/bin/env python3
"""
Simplified backend starter for FaceTrust AI
Run this file to start the face recognition backend
"""

import subprocess
import sys
import os

def install_requirements():
    """Install required packages"""
    print("📦 Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ All packages installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install packages: {e}")
        return False

def start_backend():
    """Start the backend server"""
    print("🚀 Starting FaceTrust AI Backend...")
    try:
        # Start the backend
        subprocess.run([sys.executable, "simple_backend.py"])
    except KeyboardInterrupt:
        print("\n👋 Backend stopped by user")
    except Exception as e:
        print(f"❌ Error starting backend: {e}")

if __name__ == "__main__":
    print("=" * 60)
    print("🎯 FaceTrust AI Backend Launcher")
    print("=" * 60)
    
    # Check if requirements.txt exists
    if not os.path.exists("requirements.txt"):
        print("❌ requirements.txt not found!")
        sys.exit(1)
    
    # Install requirements
    if install_requirements():
        # Start the backend
        start_backend()
    else:
        print("❌ Cannot start backend due to installation errors")
        sys.exit(1)