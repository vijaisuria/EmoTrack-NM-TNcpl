from flask import Blueprint, jsonify, request
import requests
import os
from dotenv import load_dotenv

import cv2
from deepface import DeepFace
import numpy as np
import io

import joblib
import numpy as np
import pandas as pd

load_dotenv()

emotion_routes = Blueprint('emotion_routes', __name__)

hugging_face_api_key = os.getenv('HUGGING_FACE_API_KEY')

API_URL = "https://api-inference.huggingface.co/models/jonatasgrosman/wav2vec2-large-xlsr-53-english"
headers = {"Authorization": "Bearer "}
headers["Authorization"] += hugging_face_api_key

def query(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.post(API_URL, headers=headers, data=data)
    return response.json()

@emotion_routes.route('/audio', methods=['POST'])
def analyze_audio():
    # Assuming the audio file is sent as part of the request
    audio_file = request.files['audio']
    
    if not audio_file:
        return jsonify({'message': 'Audio file not found in request'}), 400
    
    try:
        # Save the audio file
        audio_file.save('temp_audio.flac')
        
        # Query Hugging Face API
        output = query('temp_audio.flac')

        print(output)
        
        # Return the output as JSON
        return jsonify(output), 200
    except Exception as e:
        print(e)
        return jsonify({'message': f'Error analyzing audio: {str(e)}'}), 500


# Load Model
pipe_lr = joblib.load(open("./models/emotion_classifier_pipe_lr.pkl", "rb"))

# Function to predict emotions
def predict_emotions(docx):
    results = pipe_lr.predict([docx])
    return results[0]

# Function to get prediction probabilities
def get_prediction_proba(docx):
    results = pipe_lr.predict_proba([docx])
    return results

# Mapping of emotions to emojis
emotions_emoji_dict = {
    "anger": "😠", "disgust": "🤮", "fear": "😨😱", "happy": "🤗",
    "joy": "😂", "neutral": "😐", "sad": "😔", "sadness": "😔",
    "shame": "😳", "surprise": "😮"
}

@emotion_routes.route('/text', methods=['POST'])
def analyze_text():
    data = request.json
    raw_text = data.get('text')

    if not raw_text:
        return jsonify({'message': 'Text not found in request'}), 400

    try:
        # Perform emotion prediction
        prediction = predict_emotions(raw_text)
        probability = get_prediction_proba(raw_text)

        # Prepare response data
        response = {
            'original_text': raw_text,
            'predicted_emotion': prediction,
            'predicted_emoji': emotions_emoji_dict.get(prediction, ''),
            'prediction_confidence': np.max(probability),
            'prediction_probabilities': {
                emotion: proba for emotion, proba in zip(pipe_lr.classes_, probability[0])
            }
        }

        return jsonify(response), 200
    except Exception as e:
        return jsonify({'message': f'Error analyzing text: {str(e)}'}), 500



# Load face cascade classifier
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def detect_emotion(image):
    # Convert image to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Convert grayscale image to RGB format
    rgb_image = cv2.cvtColor(gray_image, cv2.COLOR_GRAY2RGB)

    # Detect faces in the image
    faces = face_cascade.detectMultiScale(gray_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    results = []
    for (x, y, w, h) in faces:
        # Extract the face ROI (Region of Interest)
        face_roi = rgb_image[y:y + h, x:x + w]

        # Perform emotion analysis on the face ROI
        result = DeepFace.analyze(face_roi, actions=['emotion'], enforce_detection=False)

        # Determine the dominant emotion
        emotion = result[0]['dominant_emotion']

        # Convert coordinates to regular Python integers
        x, y, w, h = int(x), int(y), int(w), int(h)

        print(emotion)

        results.append({"emotion": emotion, "coordinates": {"x": x, "y": y, "w": w, "h": h}})

    return results

@emotion_routes.route('/image', methods=['POST'])
def image():
    # Check if request contains an image file
    if 'file' not in request.files:
        return jsonify({'error': 'No image file provided'}), 404

    image_file = request.files['file']

    # Read image file from memory
    image_bytes = io.BytesIO()
    image_file.save(image_bytes)
    image_array = np.frombuffer(image_bytes.getvalue(), dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    # Perform emotion detection
    results = detect_emotion(image)

    return jsonify(results)