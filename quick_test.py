print("✅ Python is working!")
print("🔧 Testing imports...")

try:
    import flask
    print(f"✅ Flask: {flask.__version__}")
except ImportError:
    print("❌ Flask not installed - run: pip install flask")

try:
    import cv2
    print(f"✅ OpenCV: {cv2.__version__}")
except ImportError:
    print("❌ OpenCV not installed - run: pip install opencv-contrib-python")

try:
    import numpy as np
    print(f"✅ NumPy: {np.__version__}")
except ImportError:
    print("❌ NumPy not installed - run: pip install numpy")

print("\n🚀 If all packages are installed, you can start the backend with:")
print("   python simple_backend.py")
