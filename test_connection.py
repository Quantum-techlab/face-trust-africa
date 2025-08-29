"""
Simple test to check if the backend is working
"""
import requests
import json

def test_backend():
    print("Testing FaceTrust AI Backend Connection...")
    print("=" * 50)
    
    base_url = "http://localhost:5000"
    
    # Test 1: Health check
    try:
        print("1. Testing health endpoint...")
        response = requests.get(f"{base_url}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✓ Health check successful!")
            print(f"   Model trained: {data.get('model_trained', False)}")
            print(f"   Known faces: {data.get('known_faces', 0)}")
            print(f"   Team members: {data.get('team_members', [])}")
        else:
            print(f"✗ Health check failed with status: {response.status_code}")
    except Exception as e:
        print(f"✗ Health check failed: {e}")
    
    # Test 2: Team endpoint
    try:
        print("\n2. Testing team endpoint...")
        response = requests.get(f"{base_url}/team", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✓ Team endpoint successful!")
            print(f"   Team members: {data.get('team_members', [])}")
            print(f"   Team data entries: {len(data.get('team_data', {}))}")
        else:
            print(f"✗ Team endpoint failed with status: {response.status_code}")
    except Exception as e:
        print(f"✗ Team endpoint failed: {e}")
    
    # Test 3: Recognition endpoint with dummy data
    try:
        print("\n3. Testing recognition endpoint...")
        dummy_image_data = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD//gA7Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2NjIpLCBxdWFsaXR5ID0gOTAK/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUEBAUKBwcGCAwKDAwLCgsLDQ4SEA0OEQ4LCxAWEBETFBUVFQwPFxgWFBgSFBUU/9sAQwEDBAQFBAUJBQUJFA0LDRQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQU/8AAEQgAAQABAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBkQgUobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD5/ooooA//2Q=="
        
        payload = {
            "image": dummy_image_data
        }
        
        response = requests.post(f"{base_url}/recognize", 
                               json=payload, 
                               headers={"Content-Type": "application/json"},
                               timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print("✓ Recognition endpoint successful!")
            print(f"   Matched: {data.get('matched', False)}")
            print(f"   Confidence: {data.get('confidence', 0)}")
            if data.get('identity'):
                print(f"   Identity: {data['identity'].get('full_name', 'N/A')}")
        else:
            print(f"✗ Recognition endpoint failed with status: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"✗ Recognition endpoint failed: {e}")
    
    print("\n" + "=" * 50)
    print("Backend test complete!")

if __name__ == "__main__":
    test_backend()
