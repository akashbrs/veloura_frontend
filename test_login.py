import urllib.request
import urllib.error
import json

def test_login():
    data = json.dumps({'username':'idontexist', 'password':'wrongpassword'}).encode('utf-8')
    req = urllib.request.Request('http://localhost:8000/api/login/', data=data, headers={'Content-Type': 'application/json'})
    try:
        urllib.request.urlopen(req)
    except urllib.error.HTTPError as e:
        print("ERROR BODY:", e.read().decode('utf-8'))

test_login()
