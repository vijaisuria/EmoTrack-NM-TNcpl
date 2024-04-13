from flask import request, jsonify, Blueprint, redirect, url_for, flash
from flask_mail import Mail, Message
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, decode_token
import sqlite3
import hashlib
from extensions import mail

from dotenv import load_dotenv
import os
load_dotenv()


# Database setup
conn = sqlite3.connect('database.db', check_same_thread=False)
conn.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, email TEXT, password TEXT, verified INTEGER, UNIQUE(email, username))')
conn.commit()

auth_routes = Blueprint('auth_routes', __name__)

# Custom hashing function
def custom_hash(password):
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    return hashed_password

@auth_routes.route('/register', methods=['POST'])
def register():
    data = request.form
    username = data['username']
    email = data['email']
    password = data['password']
    
    # Check if the email or username already exists
    cursor = conn.execute('SELECT id FROM users WHERE email = ? OR username = ?', (email, username))
    existing_user = cursor.fetchone()
    if existing_user:
        flash('Email or username already registered', 'error')
        return redirect(url_for('index'))  # Redirect to root URL
    
    hashed_password = custom_hash(password)
    # hashed_password = password
    
    try:
        # Save user data to the database
        conn.execute('INSERT INTO users (username, email, password, verified) VALUES (?, ?, ?, ?)', (username, email, hashed_password, 0))
        conn.commit()
        
        # Send verification email
        token = create_access_token(identity=email)
        verification_link = f'http://localhost:5000/auth/verify?token={token}'
        msg = Message('Verify your account', sender=os.getenv('MAIL_USERNAME'), recipients=[email])
        msg.body = f'Click the following link to verify your account: {verification_link}'
        mail.send(msg)
        
        flash('User registered successfully. Verification email sent.', 'success')
        return redirect(url_for('index'))  # Redirect to root URL with success message
    except Exception as e:
        flash(f'Error registering user: {str(e)}', 'error')
        return redirect(url_for('index'))  # Redirect to root URL with error message

@auth_routes.route('/resend-mail', methods=['POST'])
def resend_mail():
    data = request.json
    username_or_email = data.get('username_or_email')

    # Check if the provided username or email exists in the database
    if '@' in username_or_email:
        query = 'SELECT email FROM users WHERE email = ?'
    else:
        query = 'SELECT email FROM users WHERE username = ?'
    
    cursor = conn.execute(query, (username_or_email,))
    user_data = cursor.fetchone()
    if user_data:
        email = user_data[0]
        try:
            # Send verification email
            token = create_access_token(identity=email)
            verification_link = f'http://localhost:5000/verify?token={token}'
            msg = Message('Verify your account', sender=os.getenv('MAIL_USERNAME'), recipients=[email])
            msg.body = f'Click the following link to verify your account: {verification_link}'
            mail.send(msg)
            
            return jsonify({'message': 'Verification email resent successfully.'}), 200
        except Exception as e:
            # Handle exceptions, such as email sending errors
            return jsonify({'message': f'Error resending verification email: {str(e)}'}), 500
    else:
        return jsonify({'message': 'User not found.'}), 404


@auth_routes.route('/verify', methods=['GET'])
def verify():
    token = request.args.get('token')
    if not token:
        return jsonify({'message': 'Token is missing.'}), 400
    
    try:
        # Decode and verify the token
        decoded_token = decode_token(token)
        email = decoded_token['sub']
    except Exception as e:
        return jsonify({'message': f'Invalid token: {str(e)}'}), 400

    # Mark the user as verified in the database
    try:
        conn.execute('UPDATE users SET verified = 1 WHERE email = ?', (email,))
        conn.commit()
        return jsonify({'message': 'Account verified successfully.'}), 200
    except Exception as e:
        return jsonify({'message': f'Error verifying account: {str(e)}'}), 500
    
@auth_routes.route('/login', methods=['POST'])
def login():
    data = request.form
    username_or_email = data['username_or_email']
    password = data['password']
    
    # Check if the username_or_email is an email or username
    if '@' in username_or_email:
        query = 'SELECT id, password, verified FROM users WHERE email = ?'
    else:
        query = 'SELECT id, password, verified FROM users WHERE username = ?'
    
    try:
        cursor = conn.execute(query, (username_or_email,))
        user_data = cursor.fetchone()

        if user_data:
            id, hashed_password, verified = user_data

            # Check if the user is verified
            if not verified:
                flash('User is not verified', 'error')
                return redirect(url_for('index'))  # Redirect to root URL

            # Verify the password
            if custom_hash(password) == hashed_password:
                # Password is correct, issue JWT token
                token = create_access_token(identity=id)
                return redirect(f'http://localhost:3000?id={token}&user={id}')
            else:
                flash('Invalid email or password', 'error')
                return redirect(url_for('index'))  # Redirect to root URL
        else:
            flash('User not found', 'error')
            return redirect(url_for('index'))  # Redirect to root URL
    except Exception as e:
        flash(f'Error during login: {str(e)}', 'error')
        return redirect(url_for('index'))  # Redirect to root URL