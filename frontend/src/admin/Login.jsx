import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// CSS and Assets
import Logo from '../assets/login/logo-light.png';
import './styles/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Using useNavigate for navigation

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8800/api/auth/admin-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Failed to login');
            } else {
                const userData = await response.json();
                sessionStorage.setItem('email', email);
                sessionStorage.setItem('role', userData.role); // Store role in session storage
                // Redirect to welcome page after successful login
                navigate('/Admin/Welcome');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('Failed to login. Please try again later.');
        }
    };

    return (
        <body>
        <div className='wrapper'>
        
            <form action=''>
                <h1> Admin Login </h1>
                <div className='input-box'>
                    <input type='text' placeholder='Email' required />
                </div>

                <div className='input-box'>
                    <input type='password' placeholder='Password' required />
                </div>

                <button type='submit'>Login</button>
                
            </form>
        </div>
        </body>
    );
}

export default Login;