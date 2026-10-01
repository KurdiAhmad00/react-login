# react-login

Full-stack authentication flow: a React frontend talking to a Flask REST API backed by MySQL.

## What it does

- **Login / Register** in a single view — toggle between modes without leaving the page
- React form with controlled inputs and client-side validation (`required`, email type)
- Flask REST API with two endpoints:
- `POST /register` — creates a user; returns `409` if the username or email already exists, `400` on missing fields
- `POST /login` — checks credentials; returns `401` on invalid login
- MySQL database auto-created on first run (`flask_login`)
- CORS enabled so the React dev server can reach the Flask API

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | React 19 (Create React App), hooks (`useState`), fetch API |
| Backend | Flask, Flask-SQLAlchemy, Flask-CORS, PyMySQL |
| Database | MySQL |

## Structure

```javascript
react-login/
├── backend/
│   ├── app.py            # Flask app: User model, /register, /login
│   └── auth/             # reserved for future route/model organization
└── login-test/           # React app (bootstrapped with CRA)
    └── src/
        └── App.js        # the whole auth UI + submit logic
```

## Run it

**Backend** (from `backend/`):

```bash
pip install flask flask-sqlalchemy flask-cors pymysql python-dotenv
python app.py          # serves on http://localhost:5000
```

**Frontend** (from `login-test/`):

```bash
npm install
npm start              # serves on http://localhost:3000
```

The frontend expects the API at `http://localhost:5000`.

## Notes & honest limitations

- Passwords are stored as plain strings — this is a learning/demo project.
A production version needs hashing (e.g. Werkzeug security or bcrypt), JWT or
session auth, and environment-based secrets. That's the roadmap.
- Built as a fundamentals exercise: connecting a React SPA to a real database
through a REST API, and handling the full request/response/status-code cycle.

## Roadmap

- [ ] Password hashing
- [ ] JWT tokens + protected routes
- [ ] Move credentials to environment variables
- [ ] Fill in `auth/models.py` and `auth/routes.py` (blueprints)