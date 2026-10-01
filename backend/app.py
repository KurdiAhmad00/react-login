import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import pymysql
from flask_cors import CORS

load_dotenv()

DB_USER = os.environ.get("DB_USER")
DB_PASS = os.environ.get("DB_PASS")
DB_HOST = os.environ.get("DB_HOST", "localhost")

app = Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)

# Create the database if it doesn't exist yet
with app.app_context():
    connection = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASS)
    cursor = connection.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS flask_login")
    connection.close()

app.config['SQLALCHEMY_DATABASE_URI'] = (
    f'mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}/flask_login'
)
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)


with app.app_context():
    db.create_all()


@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    if not username or not email or not password:
        return jsonify({'message': 'Missing fields'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'Username already exists'}), 409
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists'}), 409
    user = User(username=username, email=email, password=password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Registration successful'}), 201


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username, password=password).first()
    if user:
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
