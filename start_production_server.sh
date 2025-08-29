#!/bin/bash

# FaceTrust AI Production Server Startup Script
# This script ensures the backend is always running and handles failures gracefully

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$SCRIPT_DIR/backend_production.log"
PID_FILE="$SCRIPT_DIR/backend.pid"
MAX_RESTARTS=10
RESTART_DELAY=5

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Check if process is running
is_running() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            return 0
        else
            rm -f "$PID_FILE"
            return 1
        fi
    fi
    return 1
}

# Start the server
start_server() {
    log "Starting FaceTrust AI Production Server..."

    # Check Python
    if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
        log "ERROR: Python is not installed"
        exit 1
    fi

    # Use python3 if available, otherwise python
    PYTHON_CMD="python3"
    if ! command -v python3 &> /dev/null; then
        PYTHON_CMD="python"
    fi

    # Check Python version
    PYTHON_VERSION=$($PYTHON_CMD -c "import sys; print('.'.join(map(str, sys.version_info[:2])))")
    if [ "$(printf '%s\n' "$PYTHON_VERSION" "3.8" | sort -V | head -n1)" != "3.8" ]; then
        log "ERROR: Python 3.8+ required, found $PYTHON_VERSION"
        exit 1
    fi

    # Install dependencies if needed
    log "Checking dependencies..."
    $PYTHON_CMD -c "import flask, flask_cors, cv2, numpy" 2>/dev/null || {
        log "Installing required packages..."
        pip3 install flask flask-cors opencv-contrib-python numpy || pip install flask flask-cors opencv-contrib-python numpy
    }

    # Start server in background
    cd "$SCRIPT_DIR"
    nohup $PYTHON_CMD production_backend.py > "$LOG_FILE" 2>&1 &
    local pid=$!

    # Save PID
    echo $pid > "$PID_FILE"

    # Wait a moment and check if it's still running
    sleep 3
    if is_running; then
        log "✅ Server started successfully (PID: $pid)"
        return 0
    else
        log "❌ Server failed to start"
        rm -f "$PID_FILE"
        return 1
    fi
}

# Stop the server
stop_server() {
    if is_running; then
        local pid=$(cat "$PID_FILE")
        log "Stopping server (PID: $pid)..."
        kill -TERM "$pid" 2>/dev/null || true

        # Wait for graceful shutdown
        local count=0
        while [ $count -lt 10 ] && is_running; do
            sleep 1
            count=$((count + 1))
        done

        # Force kill if still running
        if is_running; then
            log "Force killing server..."
            kill -KILL "$pid" 2>/dev/null || true
        fi

        rm -f "$PID_FILE"
        log "✅ Server stopped"
    else
        log "Server is not running"
    fi
}

# Restart the server
restart_server() {
    log "Restarting server..."
    stop_server
    sleep 2
    start_server
}

# Monitor and auto-restart
monitor_server() {
    local restart_count=0

    while true; do
        if ! is_running; then
            if [ $restart_count -ge $MAX_RESTARTS ]; then
                log "❌ Maximum restart attempts ($MAX_RESTARTS) reached. Giving up."
                exit 1
            fi

            log "⚠️  Server is not running. Attempting restart..."
            restart_count=$((restart_count + 1))

            if start_server; then
                restart_count=0
                log "✅ Server restarted successfully"
            else
                log "❌ Restart attempt $restart_count failed"
                sleep $RESTART_DELAY
            fi
        else
            # Server is running, reset restart count
            restart_count=0
        fi

        sleep 10  # Check every 10 seconds
    done
}

# Health check
health_check() {
    if ! is_running; then
        echo "❌ Server is not running"
        return 1
    fi

    # Try to connect to health endpoint
    if curl -s -f http://localhost:5000/health > /dev/null 2>&1; then
        echo "✅ Server is healthy"
        return 0
    else
        echo "⚠️  Server is running but health check failed"
        return 1
    fi
}

# Show status
show_status() {
    echo
    echo "FaceTrust AI Production Server Status"
    echo "====================================="

    if is_running; then
        local pid=$(cat "$PID_FILE")
        echo "✅ Status: Running (PID: $pid)"

        if health_check > /dev/null 2>&1; then
            echo "✅ Health: Good"

            # Get server info
            local info=$(curl -s http://localhost:5000/status 2>/dev/null)
            if [ $? -eq 0 ]; then
                local uptime=$(echo "$info" | grep -o '"uptime":"[^"]*"' | cut -d'"' -f4)
                local known_faces=$(echo "$info" | grep -o '"known_faces":[0-9]*' | cut -d':' -f2)
                local restart_count=$(echo "$info" | grep -o '"restart_count":[0-9]*' | cut -d':' -f2)

                echo "⏱️  Uptime: $uptime"
                echo "👥 Known Faces: $known_faces"
                echo "🔄 Restart Count: $restart_count"
            fi
        else
            echo "⚠️  Health: Check failed"
        fi
    else
        echo "❌ Status: Not running"
    fi

    echo
    echo "📁 Log file: $LOG_FILE"
    echo "📄 PID file: $PID_FILE"
    echo
}

# Main script logic
case "${1:-start}" in
    start)
        if is_running; then
            echo "Server is already running"
            show_status
            exit 0
        fi

        echo "Starting FaceTrust AI Production Server..."
        if start_server; then
            echo "✅ Server started successfully"
            show_status
        else
            echo "❌ Failed to start server"
            exit 1
        fi
        ;;

    stop)
        stop_server
        ;;

    restart)
        restart_server
        show_status
        ;;

    status)
        show_status
        ;;

    monitor)
        echo "Starting server monitoring (auto-restart enabled)..."
        echo "Press Ctrl+C to stop monitoring"
        trap 'echo "Monitoring stopped"; exit 0' INT
        monitor_server
        ;;

    health)
        health_check
        ;;

    logs)
        if [ -f "$LOG_FILE" ]; then
            tail -f "$LOG_FILE"
        else
            echo "Log file not found: $LOG_FILE"
        fi
        ;;

    *)
        echo "Usage: $0 {start|stop|restart|status|monitor|health|logs}"
        echo
        echo "Commands:"
        echo "  start   - Start the server"
        echo "  stop    - Stop the server"
        echo "  restart - Restart the server"
        echo "  status  - Show server status"
        echo "  monitor - Monitor and auto-restart server"
        echo "  health  - Check server health"
        echo "  logs    - Show server logs"
        exit 1
        ;;
esac
