import hashlib

encryption_key = b'MySecretKey123'  

# Custom encryption function
def encrypt_data(data):
    cipher = hashlib.md5(encryption_key)
    cipher.update(data.encode())
    return cipher.hexdigest()

# Custom hashing function
def custom_hash(password):
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    encrypted_password = encrypt_data(hashed_password)
    return encrypted_password

# print(custom_hash('password123'))  # Output:

import requests

from dotenv import load_dotenv
import os

load_dotenv()

hugging_face_api_key = os.getenv('HUGGING_FACE_API_KEY')

API_URL = "https://api-inference.huggingface.co/models/jonatasgrosman/wav2vec2-large-xlsr-53-english"
headers = {"Authorization": "Bearer "}
headers["Authorization"] += hugging_face_api_key

def query(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.post(API_URL, headers=headers, data=data)
    return response.json()

output = query("sample.flac")

print(output)