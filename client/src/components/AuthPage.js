import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config'; 
import './AuthPage.css'; 

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      if (isLogin) {
        console.log('Login Data:', { email, password });
        const response = await axios.post(`${config.backendUrl}/auth/login`, { email, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId); 
        localStorage.setItem('userName', response.data.userName);
        navigate('/movies');
      } else {
        console.log('Register Data:', { firstName, lastName, email, password, confirmPassword });
        const response = await axios.post(`${config.backendUrl}/auth/register`, {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId); 
        localStorage.setItem('userName', `${firstName} ${lastName}`); 
        navigate('/movies');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(isLogin ? 'Invalid email or password' : 'Failed to register. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </>
        )}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {!isLogin && (
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}
        {error && <p className="error">{error}</p>}
        <div className="button-container">
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Switch to Register' : 'Switch to Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuthPage;