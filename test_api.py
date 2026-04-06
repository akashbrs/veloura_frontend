import urllib.request
import urllib.error
import json

def test_api(url, payload):
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(f'http://localhost:8000{url}', data=data, headers={'Content-Type': 'application/json'})
    print(f"Testing {url} with {payload}")
    try:
        res = urllib.request.urlopen(req)
        print("SUCCESS:", res.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print("ERROR:", e.code, e.read().decode('utf-8'))
    except Exception as e:
        print("FAIL:", e)

# Test 1: What is the frontend login payload exactly?
# We changed it to send: {"username": "foo@bar.com", "password": "..."}
test_api('/api/login/', {'username': 'testuser123', 'password': 'password123'})

# Test 2: What is the frontend signup payload exactly?
test_api('/api/signup/', {'username': 'testuser123', 'email': 'testuser123@example.com', 'password': 'password123'})
