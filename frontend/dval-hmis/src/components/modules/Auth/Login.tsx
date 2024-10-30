import React from 'react'
import loginPicture from '../../../assets/images/login-picture.jpeg'
import './Login.css'
import { Link, Outlet } from 'react-router-dom'

type Props = {}

export default function Login({}: Props) {
  return (
    <div className="login__container">
    <div className="login__left__container">
    <img src={loginPicture} alt="login" />
    </div>

    {/* form to handle login purposes */}
    <div className="login__right__container">
    <h1 id="main-page-header">DVAL HMIS</h1>
    <p style={{ fontSize: "0.7rem", fontStyle: "italic" }}>Redefining healthcare through better management</p>
    <h2 id="login-page-header">Login Page</h2>
        <form action="">
            <label htmlFor="hospitalName">Hospital Name</label>
            <input 
            type='text'
            id='hospitalName'
            // value={hospitalName}
            // onChange={(e) => setH}
            />

            <label htmlFor='email'>Email Address</label>
            <input
            type='email'
            id='email'/>

            <label htmlFor='password'>Password</label>
            <input 
            type='password'
            id='password' />

            <button id='login'>Login</button>
        </form>
        
    {/* signup section */}
    <div className="signup-section">
    <p style={{ fontSize: '0.8rem' }}>Not registered? No worries, Signup today...</p>
    <button id='signup'><Link to="/signup">Signup</Link></button>
    <Outlet />
    </div>

    </div>
    </div>

    
  )
}