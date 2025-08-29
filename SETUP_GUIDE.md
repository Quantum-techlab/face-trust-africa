# FaceTrust AI - Face Recognition System

## 🚀 Quick Start Guide

### Prerequisites

- Python 3.10+
- Node.js 16+
- npm or yarn

### Installation & Setup

1. **Install Python Dependencies**

   ```bash
   pip install -r src/model/requirements.txt
   ```

2. **Install Frontend Dependencies**

   ```bash
   npm install
   ```

3. **Prepare Face Models**
   - Place team member photos (`.jpg` files) in `src/model/Models/`
   - Name files as `FirstName_LastName.jpg` (e.g., `John_Doe.jpg`)
   - Ensure photos show clear faces

### Running the Application

#### Option 1: Using Batch File (Windows)

```bash
# Start backend server
start_server.bat

# In another terminal, start frontend
npm run dev
```

#### Option 2: Manual Start

```bash
# Terminal 1: Start Backend Server
python run_server.py

# Terminal 2: Start Frontend
npm run dev
```

### Accessing the Application

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 📁 Project Structure

```
face-trust-africa/
├── src/
│   ├── model/               # Python Backend
│   │   ├── Models/          # Training Images
│   │   │   ├── Person1_Name.jpg
│   │   │   ├── Person2_Name.jpg
│   │   │   └── team_data.json
│   │   ├── face_model.py    # Face Recognition Logic
│   │   ├── web_interface.py # Flask API
│   │   └── requirements.txt # Python Dependencies
│   ├── components/          # React Components
│   ├── pages/               # Application Pages
│   └── services/            # API Services
├── run_server.py            # Robust Backend Starter
├── start_server.bat         # Windows Batch File
├── test_api.py              # API Testing Script
└── package.json             # Frontend Dependencies
```

## 🔧 API Endpoints

### Health Check

```
GET /health
Response: {
  "status": "healthy",
  "model_loaded": true,
  "model_trained": true,
  "known_faces": 2,
  "team_members": ["Person1_Name", "Person2_Name"]
}
```

### Face Recognition

```
POST /recognize
Body: {
  "image": "data:image/jpeg;base64,..."
}
Response: {
  "matched": true/false,
  "confidence": 0.95,
  "identity": { ... },
  "liveness": 0.95
}
```

### Team Members

```
GET /team
Response: {
  "team_members": [...],
  "team_data": { ... }
}
```

## 🛠️ Troubleshooting

### Backend Issues

1. **"Module not found" errors**: Run `pip install -r src/model/requirements.txt`
2. **"API not reachable"**: Ensure backend is running on port 5000
3. **"Model not trained"**: Check that `.jpg` files exist in `src/model/Models/`

### Frontend Issues

1. **Port conflicts**: Frontend runs on 8080, backend on 5000
2. **API connection**: Check network connectivity to localhost:5000

### Face Recognition Issues

1. **Low accuracy**: Ensure training images show clear, front-facing photos
2. **No faces detected**: Improve lighting and image quality
3. **Model untrained**: Verify at least one `.jpg` file exists in Models folder

## ✅ System Status Verification

Run the test script to verify everything is working:

```bash
python test_api.py
```

Expected output:

```
✓ API is reachable!
✓ Model loaded: True
✓ Model trained: True
✓ Known faces: 2
✓ Team members: ['Person1_Name', 'Person2_Name']
🎉 SUCCESS: API is working and model is trained!
```

## 🔒 Security Notes

- This is a development server - use a production WSGI server for deployment
- Face recognition data is stored locally
- No external API calls are made

## 📝 Adding New Team Members

1. Add their photo as `FirstName_LastName.jpg` to `src/model/Models/`
2. Restart the backend server to retrain the model
3. Verify the new member appears in the health check

---

## Current Status ✅

- ✅ Backend server running on port 5000
- ✅ Model trained with 2 team members:
  - Abdulrasaq_Abdulrasaq
  - Mukhtar_Fathiyah
- ✅ Frontend running on port 8080
- ✅ API endpoints working correctly
- ✅ Face recognition ready for testing
