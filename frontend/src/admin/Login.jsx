import React, { useState, useEffect } from 'react'

// CSS and Assets
import "./styles/Login.css"
import Logo from '../assets/login/logo-light.png';

function Login() {

  return (
    <>
    <div className="adminContainer">
        <div className="adminPanel">
            <div className="adminLogoPanel">
                <img src={Logo} alt='Logo' className='adminLogo' />
            </div>
            <div className="adminLoginPanel">
                <div className="adminLoginPanelHeader">
                    <h1> Admin Login </h1>
                </div>
                <div className="adminLoginPanelInputs">
                    <div className="adminLoginPanelInput">
                        <input 
                            type="email" 
                        />
                        <label htmlFor="email"> Email Address </label>
                    </div>
                    <div className="adminLoginPanelInput">
                        <input 
                            type="password" 
                        />
                        <label htmlFor="password"> Password </label>
                    </div>
                </div>
                <div className="adminLoginPanelLogin">
                    <button
                        className='adminLoginButton'
                    >
                    Log In
                    </button>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}

export default Login;
