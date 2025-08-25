# FaceTrust AI - Face Recognition Model

This folder contains the face recognition model and API for the FaceTrust AI system.

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd src/model
pip install -r requirements.txt
```

**Note**: Installing `dlib` and `face_recognition` can be tricky. If you encounter issues:

**For Windows:**
```bash
pip install cmake
pip install dlib
pip install face_recognition
```

**For macOS:**
```bash
brew install cmake
pip install dlib
pip install face_recognition
```

**For Ubuntu/Linux:**
```bash
sudo apt-get install cmake
sudo apt-get install python3-dev
pip install dlib
pip install face_recognition
```

### 2. Add Team Member Images

1. Place team member photos in the `Models/` folder
2. Name the files using the format: `FirstName_LastName.jpg` (e.g., `Abdulrasaq_Abdulrasaq.jpg`)
3. Update the `team_data.json` file with corresponding member information

### 3. Start the Face Recognition API

```bash
python web_interface.py
```

The API will start on `http://localhost:5000`

## API Endpoints

- `GET /` - API information
- `GET /health` - Health check and model status
- `GET /team` - Get team member data
- `POST /recognize` - Recognize face from base64 image
- `POST /upload_team_member` - Upload new team member

## Adding Your Photo (Abdulrasaq Abdulrasaq)

1. Take a clear, well-lit photo of yourself
2. Save it as `Abdulrasaq_Abdulrasaq.jpg` in the `Models/` folder
3. The system will automatically load and encode your face
4. Your data is already configured in `team_data.json`

## Integration with React Frontend

The Python API is designed to work with your existing React verification system. It returns responses in the same format as your mock verification service.

## File Structure

```
src/model/
├── Models/                     # Team member photos
│   ├── Abdulrasaq_Abdulrasaq.jpg  # Your photo (add this)
│   └── team_data.json         # Team member data
├── face_recognition.py        # Core face recognition class
├── web_interface.py          # Flask API server
├── requirements.txt          # Python dependencies
└── README.md                # This file
```

## Testing

1. Start the API server
2. Visit `http://localhost:5000/health` to check if your face is loaded
3. Use the React frontend to capture and verify faces
4. The system will recognize team members and return their data

## Troubleshooting

- **No face detected**: Ensure good lighting and face is clearly visible
- **Low confidence**: Try different angles or better lighting
- **Import errors**: Make sure all dependencies are installed correctly
- **Camera issues**: Check camera permissions and availability