import React, { useState } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import loginPicture from '../../../assets/images/login-picture.jpeg';
import './Login.css';

type Props = {};

export default function Login({}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    try {
      //login route used during login
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      if (response.ok) {
        // parse json response and then in case its empty catch the error
        const data = await response.json().catch(() => null);
        if (data && data.token) {
          alert('Login successful!');
          localStorage.setItem('token', data.token); 

          //on successful login, redirect to dashboard
          //use navigate function to define the redirects
          navigate('/dashboard');
        } else {
          alert('Login successful, but no token received.');
        }
      } else {
        
        const errorData = await response.json().catch(() => ({
           message: 'Login failed. Please try again.' 
          })
        );
        alert(`Login failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login. Please try again later.');
    }
  };
  

  return (
    <div className="login__container">
      <div className="login__left__container">
        <img src={loginPicture} alt="login" />
      </div>

      {/* form to handle login purposes */}
      <div className="login__right__container">
        <h1 id="main-page-header">DVAL HMIS</h1>
        <p style={{ fontSize: "0.7rem", fontStyle: "italic" }}>
          Redefining healthcare through better management
          </p>
          
        <h2 id="login-page-header">Login Page</h2>
        
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" id="login">Login</button>
        </form>

        {/* signup section */}
        <div className="signup-section">
          <p style={{ fontSize: '0.8rem' }}>Not registered? No worries, Signup today...</p>
          <button id='signup'><Link to="/signup">Signup</Link></button>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
