from flask import Flask, request, jsonify, render_template
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, decode_token
import sqlite3
from extensions import mail
from flask_cors import CORS

from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USE_TLS'] = False

mail.init_app(app)
jwt = JWTManager(app)

# Database setup
conn = sqlite3.connect('database.db', check_same_thread=False)
conn.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, email TEXT, password TEXT, verified INTEGER, UNIQUE(email, username))')
conn.commit()

from routes.auth_routes import auth_routes
from routes.emotion_routes import emotion_routes

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


app.register_blueprint(auth_routes, url_prefix='/auth')
app.register_blueprint(emotion_routes, url_prefix='/emotrack')

@app.route('/chat')
def chat():
    token = request.args.get('token')
    if not token:
        return jsonify({'message': 'Token is missing.'}), 400
    
    decoded_token = decode_token(token)
    id = decoded_token['sub']
    return render_template('chat.html', token=id)

@app.route('/user/<int:user_id>')
def get_user(user_id):
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()

    if not user:
        return jsonify({'error': 'User not found'}), 404

    user_data = {
        'id': user[0],
        'username': user[1],
        'email': user[2],
        'verified': user[4]
    }
    return jsonify(user_data), 200

if __name__ == '__main__':
    app.run(debug=True)
