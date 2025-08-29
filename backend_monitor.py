#!/usr/bin/env python3
"""
FaceTrust AI Backend Monitor
Continuously monitors the backend server and ensures it's always reachable
"""
import requests
import time
import logging
import subprocess
import sys
import os
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('backend_monitor.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class BackendMonitor:
    def __init__(self, base_url="http://localhost:5000", check_interval=30):
        self.base_url = base_url
        self.check_interval = check_interval
        self.last_restart = None
        self.restart_count = 0
        self.max_restarts_per_hour = 5
        self.consecutive_failures = 0
        self.max_consecutive_failures = 3

        # Get the directory where this script is located
        self.script_dir = os.path.dirname(os.path.abspath(__file__))
        self.backend_script = os.path.join(self.script_dir, "production_backend.py")

    def check_health(self):
        """Check if the backend is healthy"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    logger.info(f"✅ Backend healthy - {data.get('known_faces', 0)} faces, uptime: {data.get('uptime', 'unknown')}")
                    return True, data
                else:
                    logger.warning(f"⚠️  Backend responding but not healthy: {data}")
                    return False, data
            else:
                logger.warning(f"⚠️  Backend returned status {response.status_code}")
                return False, None
        except requests.exceptions.RequestException as e:
            logger.error(f"❌ Backend not reachable: {e}")
            return False, None
        except Exception as e:
            logger.error(f"❌ Health check error: {e}")
            return False, None

    def start_backend(self):
        """Start the backend server"""
        try:
            logger.info("🚀 Starting backend server...")

            # Check if backend script exists
            if not os.path.exists(self.backend_script):
                logger.error(f"Backend script not found: {self.backend_script}")
                return False

            # Start the backend process
            process = subprocess.Popen([
                sys.executable, self.backend_script
            ], cwd=self.script_dir, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

            # Wait a moment for startup
            time.sleep(5)

            # Check if process is still running
            if process.poll() is None:
                logger.info("✅ Backend server started successfully")
                self.last_restart = datetime.now()
                self.restart_count += 1
                return True
            else:
                stdout, stderr = process.communicate()
                logger.error(f"❌ Backend failed to start")
                if stdout:
                    logger.error(f"STDOUT: {stdout.decode()}")
                if stderr:
                    logger.error(f"STDERR: {stderr.decode()}")
                return False

        except Exception as e:
            logger.error(f"❌ Failed to start backend: {e}")
            return False

    def stop_backend(self):
        """Stop the backend server"""
        try:
            logger.info("🛑 Stopping backend server...")

            # Try graceful shutdown via API
            try:
                response = requests.post(f"{self.base_url}/shutdown", timeout=5)
                if response.status_code == 200:
                    logger.info("✅ Backend stopped gracefully")
                    return True
            except:
                pass

            # Find and kill Python processes running the backend
            try:
                result = subprocess.run([
                    "pgrep", "-f", "production_backend.py"
                ], capture_output=True, text=True)

                if result.returncode == 0:
                    pids = result.stdout.strip().split('\n')
                    for pid in pids:
                        if pid.strip():
                            subprocess.run(["kill", "-TERM", pid.strip()])
                            logger.info(f"✅ Killed backend process {pid.strip()}")

                    time.sleep(2)
                    return True
            except:
                pass

            logger.warning("⚠️  Could not stop backend gracefully")
            return False

        except Exception as e:
            logger.error(f"❌ Error stopping backend: {e}")
            return False

    def should_restart(self):
        """Determine if we should attempt to restart the backend"""
        now = datetime.now()

        # Check restart rate limit
        if self.last_restart and now - self.last_restart < timedelta(hours=1):
            recent_restarts = self.restart_count
            if recent_restarts >= self.max_restarts_per_hour:
                logger.warning(f"⚠️  Too many restarts in the last hour ({recent_restarts}), waiting...")
                return False

        # Check consecutive failures
        if self.consecutive_failures >= self.max_consecutive_failures:
            logger.error(f"❌ Too many consecutive failures ({self.consecutive_failures}), stopping monitoring")
            return False

        return True

    def monitor(self):
        """Main monitoring loop"""
        logger.info("🔍 Starting FaceTrust AI Backend Monitor")
        logger.info(f"📊 Monitoring {self.base_url} every {self.check_interval} seconds")
        logger.info("=" * 60)

        while True:
            try:
                healthy, data = self.check_health()

                if healthy:
                    self.consecutive_failures = 0
                    logger.info("✅ Backend is healthy and reachable")
                else:
                    self.consecutive_failures += 1
                    logger.warning(f"⚠️  Backend unhealthy (failure {self.consecutive_failures}/{self.max_consecutive_failures})")

                    if self.should_restart():
                        logger.info("🔄 Attempting to restart backend...")

                        # Stop existing backend
                        self.stop_backend()
                        time.sleep(2)

                        # Start new backend
                        if self.start_backend():
                            logger.info("✅ Backend restarted successfully")
                            self.consecutive_failures = 0
                        else:
                            logger.error("❌ Failed to restart backend")
                    else:
                        logger.error("❌ Not attempting restart due to rate limits")

                # Wait for next check
                time.sleep(self.check_interval)

            except KeyboardInterrupt:
                logger.info("🛑 Monitor stopped by user")
                break
            except Exception as e:
                logger.error(f"❌ Monitor error: {e}")
                time.sleep(self.check_interval)

    def get_status(self):
        """Get current status"""
        healthy, data = self.check_health()

        status = {
            "healthy": healthy,
            "url": self.base_url,
            "last_check": datetime.now().isoformat(),
            "consecutive_failures": self.consecutive_failures,
            "restart_count": self.restart_count,
            "last_restart": self.last_restart.isoformat() if self.last_restart else None,
            "data": data
        }

        return status

def main():
    """Main entry point"""
    import argparse

    parser = argparse.ArgumentParser(description="FaceTrust AI Backend Monitor")
    parser.add_argument("--url", default="http://localhost:5000", help="Backend URL to monitor")
    parser.add_argument("--interval", type=int, default=30, help="Check interval in seconds")
    parser.add_argument("--status", action="store_true", help="Show current status and exit")

    args = parser.parse_args()

    monitor = BackendMonitor(args.url, args.interval)

    if args.status:
        status = monitor.get_status()
        print(f"Backend Status: {'✅ Healthy' if status['healthy'] else '❌ Unhealthy'}")
        print(f"URL: {status['url']}")
        print(f"Consecutive Failures: {status['consecutive_failures']}")
        print(f"Restart Count: {status['restart_count']}")
        if status['data']:
            print(f"Known Faces: {status['data'].get('known_faces', 0)}")
            print(f"Uptime: {status['data'].get('uptime', 'unknown')}")
        sys.exit(0 if status['healthy'] else 1)
    else:
        monitor.monitor()

if __name__ == "__main__":
    main()
