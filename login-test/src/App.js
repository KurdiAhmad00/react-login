import React, { useState } from 'react';
import './App.css';

function App() {
  // State for form inputs and view toggle
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Tracks login/register view

  // Combined submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // LOGIN: send POST to backend
      try {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        if (response.ok) {
          alert(data.message || 'Login successful!');
        } else {
          alert(data.message || 'Invalid credentials');
        }
      } catch (err) {
        alert('Error connecting to server');
      }
    } else {
      // REGISTER: send POST to backend
      try {
        const response = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        if (response.ok) {
          alert(data.message || 'Registration successful!');
          setIsLogin(true);
        } else {
          alert(data.message || 'Registration failed');
        }
      } catch (err) {
        alert('Error connecting to server');
      }
    }
  };

  return (
    <div className="auth-container">
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Username Field (always shown) */}
        <div className="input-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Email Field (only for register) */}
        {!isLogin && (
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}

        {/* Password Field (always shown) */}
        <div className="input-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <p className="toggle-text">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="toggle-btn"
        >
          {isLogin ? 'Register here' : 'Login here'}
        </button>
      </p>
    </div>
  );
}

export default App;