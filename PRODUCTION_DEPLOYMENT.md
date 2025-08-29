# FaceTrust AI Production Deployment Guide

## 🚀 Production Deployment Overview

This guide covers deploying FaceTrust AI with a **always-reachable** Python backend that includes:

- Auto-restart on failures
- Health monitoring
- Production-ready configuration
- Comprehensive logging
- Multiple deployment options

## 📋 Prerequisites

### System Requirements

- **Python 3.8+** (required)
- **4GB RAM** minimum
- **2GB disk space** for models and logs
- **Linux/Windows/macOS** compatible

### Network Requirements

- **Port 5000** must be available
- **HTTP access** to backend from frontend
- **CORS configuration** for web deployment

## 🛠️ Quick Start (Recommended)

### Option 1: Windows Production Server

```bash
# Double-click this file to start production server:
start_production_server.bat
```

### Option 2: Linux/Mac Production Server

```bash
# Make script executable
chmod +x start_production_server.sh

# Start production server
./start_production_server.sh start

# Start with monitoring (auto-restart)
./start_production_server.sh monitor
```

### Option 3: Python Direct

```bash
# Install dependencies
pip install flask flask-cors opencv-contrib-python numpy

# Start production server
python production_backend.py
```

## 🔧 Production Configuration

### 1. Environment Setup

```bash
# Create production directory
mkdir -p /opt/facetrust-ai
cd /opt/facetrust-ai

# Clone or copy project files
# ... copy all files from your project ...

# Set proper permissions
chmod +x start_production_server.sh
chmod +x backend_monitor.py
```

### 2. Service Configuration (Linux)

```bash
# Copy service file
sudo cp facetrust-backend.service /etc/systemd/system/

# Edit service file with correct paths
sudo nano /etc/systemd/system/facetrust-backend.service

# Reload systemd and start service
sudo systemctl daemon-reload
sudo systemctl enable facetrust-backend
sudo systemctl start facetrust-backend

# Check status
sudo systemctl status facetrust-backend
```

### 3. Monitoring Setup

```bash
# Start monitoring (auto-restart on failures)
./start_production_server.sh monitor

# Or run monitor separately
python backend_monitor.py --url http://localhost:5000 --interval 30
```

## 📊 Health Monitoring

### Check Backend Status

```bash
# Quick status check
./start_production_server.sh status

# Health endpoint
curl http://localhost:5000/health

# Detailed server info
curl http://localhost:5000/status
```

### Monitor Logs

```bash
# View production logs
./start_production_server.sh logs

# Monitor with auto-scroll
tail -f backend.log

# Monitor with timestamps
tail -f backend_production.log
```

## 🌐 Deployment Scenarios

### Scenario 1: Local Development

```bash
# Start backend
python production_backend.py

# Frontend connects to http://localhost:5000
# Backend always reachable on local machine
```

### Scenario 2: Single Server Deployment

```bash
# Backend on same server as frontend
# Configure frontend to use relative URLs or localhost:5000
# Use reverse proxy (nginx) for production
```

### Scenario 3: Separate Backend Server

```bash
# Backend on dedicated server
# Configure CORS in production_backend.py
# Update frontend API_BASE_URL to backend server IP
```

### Scenario 4: Cloud Deployment

```bash
# AWS/GCP/Azure VM
# Use cloud load balancer
# Configure security groups for port 5000
# Use cloud monitoring (CloudWatch, Stackdriver)
```

## 🔒 Security Configuration

### 1. CORS Setup

Edit `production_backend.py`:

```python
CORS(app, origins=[
    "https://yourdomain.com",
    "https://www.yourdomain.com",
    "http://localhost:3000",  # Development
], methods=["GET", "POST", "OPTIONS"], allow_headers=["Content-Type", "Authorization"])
```

### 2. Firewall Configuration

```bash
# Linux (ufw)
sudo ufw allow 5000

# Windows Firewall
# Add inbound rule for port 5000
```

### 3. SSL/TLS (Recommended)

```bash
# Use reverse proxy (nginx) with SSL
# Or configure SSL in Flask (advanced)
```

## 📈 Performance Optimization

### 1. Server Configuration

```python
# In production_backend.py, adjust for your server
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload
```

### 2. Resource Limits

```bash
# Linux systemd service limits
MemoryLimit=1G
CPUQuota=50%%
```

### 3. Monitoring Thresholds

```python
# Adjust in backend_monitor.py
MAX_RESTARTS_PER_HOUR = 5
MAX_CONSECUTIVE_FAILURES = 3
CHECK_INTERVAL = 30  # seconds
```

## 🚨 Troubleshooting

### Backend Won't Start

```bash
# Check Python version
python --version  # Must be 3.8+

# Check dependencies
python -c "import flask, flask_cors, cv2, numpy"

# Check port availability
netstat -an | grep :5000

# Check logs
tail -f backend.log
```

### Backend Keeps Restarting

```bash
# Check system resources
free -h  # Memory usage
df -h    # Disk space

# Check error logs
grep "ERROR" backend.log

# Test health endpoint manually
curl -v http://localhost:5000/health
```

### Frontend Can't Connect

```bash
# Test backend directly
curl http://localhost:5000/health

# Check CORS headers
curl -H "Origin: http://localhost:3000" -v http://localhost:5000/health

# Verify frontend configuration
# Check API_BASE_URL in faceRecognitionService.ts
```

### High Memory Usage

```bash
# Monitor memory usage
ps aux | grep python

# Adjust Flask configuration
app.config['MAX_CONTENT_LENGTH'] = 8 * 1024 * 1024  # Reduce upload limit
```

## 📝 Log Files

### Production Logs

- `backend.log` - General application logs
- `backend_production.log` - Production server logs
- `backend_monitor.log` - Monitoring system logs

### Log Rotation

```bash
# Linux logrotate configuration
/var/log/facetrust/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
}
```

## 🔄 Backup and Recovery

### 1. Model Backup

```bash
# Backup model files
tar -czf model_backup_$(date +%Y%m%d).tar.gz src/model/Models/

# Backup configuration
cp production_backend.py backup/
cp *.service backup/
```

### 2. Recovery Procedure

```bash
# Stop services
./start_production_server.sh stop

# Restore backups
tar -xzf model_backup_20241201.tar.gz

# Restart services
./start_production_server.sh start
```

## 📞 Support and Monitoring

### Health Check Endpoint

```json
GET /health
{
  "status": "healthy",
  "model_trained": true,
  "known_faces": 2,
  "server_running": true,
  "uptime": "1 day, 2:30:15",
  "restart_count": 0
}
```

### Monitoring Integration

```bash
# Prometheus metrics (optional)
pip install prometheus_client

# Add to production_backend.py
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST

@app.route('/metrics')
def metrics():
    return generate_latest(), 200, {'Content-Type': CONTENT_TYPE_LATEST}
```

## 🎯 Success Checklist

- [ ] Backend starts without errors
- [ ] Health endpoint returns "healthy"
- [ ] Known faces count matches your team
- [ ] Frontend can connect and shows correct member count
- [ ] Auto-restart works on failures
- [ ] Logs are being written
- [ ] CORS allows frontend connections
- [ ] Port 5000 is accessible
- [ ] Memory usage is stable
- [ ] Response times are acceptable

## 🚀 Next Steps

1. **Test thoroughly** in your environment
2. **Configure monitoring** alerts
3. **Set up backups** for model files
4. **Configure SSL** for production
5. **Set up log aggregation** if needed
6. **Monitor performance** and adjust as needed

Your FaceTrust AI backend is now production-ready with automatic recovery and comprehensive monitoring! 🎉
