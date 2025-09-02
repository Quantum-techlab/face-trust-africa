# Face Recognition Model

This directory contains the face recognition model implementation using LBPH (Local Binary Pattern Histogram) algorithm.

## Quick Start

1. Ensure your backend is running on Railway:
   The API will start on `https://face-trust-africa-production.up.railway.app`

2. Visit `https://face-trust-africa-production.up.railway.app/health` to check if your face is loaded

## API Endpoints

- `GET /health` - Check API status
- `GET /team` - Get team member information
- `POST /recognize` - Face recognition endpoint

## Production Deployment

The backend is deployed on Railway at:
https://face-trust-africa-production.up.railway.app

## Local Development

For local development, you can still run:

```bash
python src/model/web_interface.py
```

But make sure to update the frontend API configuration to point to localhost for development.
