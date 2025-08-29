import requests
import json

def test_api():
    try:
        # Test health endpoint
        print("Testing Face Recognition API...")
        response = requests.get('http://localhost:5000/health')
        
        if response.status_code == 200:
            data = response.json()
            print("✓ API is reachable!")
            print(f"✓ Model loaded: {data.get('model_loaded', False)}")
            print(f"✓ Model trained: {data.get('model_trained', False)}")
            print(f"✓ Known faces: {data.get('known_faces', 0)}")
            print(f"✓ Team members: {data.get('team_members', [])}")
            
            if data.get('model_loaded') and data.get('known_faces', 0) > 0:
                print("\n🎉 SUCCESS: API is working and model is trained!")
                return True
            else:
                print("\n❌ Model is not trained or no faces loaded")
                return False
        else:
            print(f"❌ API returned status code: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ API is not reachable: {e}")
        return False

if __name__ == "__main__":
    test_api()
