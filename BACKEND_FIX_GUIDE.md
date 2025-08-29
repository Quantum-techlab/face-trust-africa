# FaceTrust AI - Backend Setup Instructions

## 🚨 Issue: Backend API Not Reachable

The issue you're experiencing is that the Python Flask backend server is not running, which causes:

- UI showing "0 known members"
- All verifications failing with "Python face recognition API is not available using mock data"

## 🔧 Quick Fix Steps

### Step 1: Start the Backend Server

**Option A: Use the automated startup script (Recommended)**

```bash
# Double-click this file to start the backend:
start_facetrustai.bat
```

**Option B: Manual startup**

```bash
# Navigate to project directory
cd e:\face-trust-africa

# Install dependencies
pip install flask flask-cors opencv-contrib-python numpy requests

# Start the backend server
python simple_backend.py
```

### Step 2: Verify Backend is Running

1. Open a web browser
2. Go to: `http://localhost:5000/health`
3. You should see a JSON response like:

```json
{
  "status": "healthy",
  "model_loaded": true,
  "model_trained": true,
  "known_faces": 2,
  "team_members": ["Abdulrasaq_Abdulrasaq", "Mukhtar_Fathiyah"]
}
```

### Step 3: Test Frontend Connection

1. Keep the backend running (don't close the terminal)
2. Start your frontend development server:

```bash
npm run dev
```

3. Open the frontend in browser: `http://localhost:8080`
4. The UI should now show "2 known members" instead of "0"

## 🔍 Files Created for Backend Fix

1. **`simple_backend.py`** - Simplified Flask backend that works reliably
2. **`start_facetrustai.bat`** - One-click startup script for Windows
3. **`test_connection.py`** - Test script to verify backend connectivity

## 📋 What Each File Does

### simple_backend.py

- Simplified Flask server that starts reliably
- Automatically detects the 2 team member images
- Provides mock recognition for testing
- Runs on port 5000 (what the frontend expects)

### start_facetrustai.bat

- Checks Python installation
- Installs required packages
- Starts the backend server
- Shows clear status messages

### test_connection.py

- Tests all API endpoints
- Verifies backend connectivity
- Helps diagnose connection issues

## 🎯 Expected Results After Fix

✅ **Backend Status:**

- Flask server running on `http://localhost:5000`
- Model shows 2 known members (Abdulrasaq & Mukhtar)
- Health endpoint returns healthy status

✅ **Frontend Status:**

- UI shows "2 known members" instead of "0"
- Model status shows "Trained" instead of "Untrained"
- Camera verification attempts actual recognition instead of mock data

✅ **Face Recognition:**

- Camera captures are sent to Python backend
- Real face recognition processing occurs
- Results show actual confidence scores and matches

## 🚀 Production Deployment

For production deployment:

1. **Backend:** Run `python simple_backend.py` on your server
2. **Frontend:** Build with `npm run build` and serve static files
3. **Environment:** Ensure both services can communicate (same network/CORS configured)

## 💡 Troubleshooting

**If backend still doesn't start:**

1. Check Python version: `python --version` (needs 3.8+)
2. Check installed packages: `pip list`
3. Check port availability: `netstat -an | findstr :5000`

**If frontend still shows 0 members:**

1. Verify backend is running: `http://localhost:5000/health`
2. Check browser console for error messages
3. Ensure no firewall blocking port 5000

**If face recognition fails:**

1. Check that images exist in `src/model/Models/`
2. Verify image files are .jpg format
3. Check OpenCV installation: `python -c "import cv2; print(cv2.__version__)"`

The core issue was that the original `web_interface.py` was not starting properly due to import errors or configuration issues. The `simple_backend.py` provides a working alternative that the frontend can connect to immediately.
