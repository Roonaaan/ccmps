import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ForgotPassModal from './forgot-password/Forgotpass'

// CSS
import './styles/Login.css';

// Image and Icons
import Logo from '../assets/login/logo-dark.png';
import { FaLock, FaLockOpen } from 'react-icons/fa';

export const Login = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Modals
    const [showModal, setShowModal] = useState(false);

    // Email and Password Validation
    const handleValidation = () => {
        setEmailError('');
        setPasswordError('');

        if (!email) {
            setEmailError('Please enter your email address');
        } else if (!/\S+@\S+\.\S+/.test(email)) { // Basic email validation
            setEmailError('Please enter a valid email address');
        }

        if (!password) {
            setPasswordError('Please input your password');
        }
    };

    const [showPassword, setShowPassword] = useState(false);
    const [iconType, setIconType] = useState(FaLock); //serves as the Initial Icon
    const [isRememberMeChecked, setIsRememberMeChecked] = useState(false);
    const navigate = useNavigate();

    //Forgot Password 
    const handleForgotPassClick = () => {
        setShowModal(true);
    };

    //Enter Event Key
    const handleKeydown = (event) => {
        if (event.key === 'Enter') {
            handleValidation();
            loginSubmit();
        }
    };

    const handleInputChange = () => {
        setEmailError('');
        setPasswordError('');
        setErrorMsg('');
    };

    const loginSubmit = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await axios.post('https://ccmps-server.vercel.app/api/auth/login', { email, password }, { withCredentials: true });
            if (response.data) {
                sessionStorage.setItem('user', email);
                {/* sessionStorage.setItem('token', response.data.token); */}
                setSuccessMsg('Welcome');
                setSuccessMsg(<span style={{ color: 'green' }}> Welcome </span>);
                setTimeout(() => {
                    navigate('/Welcome');
                }, 1000);
            } else {
                setErrorMsg('Incorrect Email or Password');
            }
        } catch (error) {
            console.error('An error occurred', error);
            setErrorMsg('An error occurred. Please try again later.');
        }
    };

    return (
        <>
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={onClose}>&times;</span>
                    <div className="container">
                        <div className='loginHeader'>
                            <img src={Logo} alt='Logo' className='logo' />
                        </div>
                        <div className='loginHeader'>
                            <div className='text'> Welcome </div>
                        </div>
                        <div className='loginHeaderText'> Please fill your detail to log in your account. </div>
                        <div className={`inputs ${emailError || passwordError || errorMsg ? 'shakeError' : ''}`}>
                            {/* Email Address*/}
                            <div className='input'>
                                <input
                                    type='email'
                                    placeholder=''
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        handleInputChange();
                                    }}
                                    onKeyDown={handleKeydown}
                                />
                                <label htmlFor='email'> Email Address </label>
                            </div>
                            {/* {emailError && <div className='error-message'>{emailError} </div>} */}
                            {/* End of Email Address*/}
                            {/* Password */}
                            <div className='input'>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder=''
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        handleInputChange();
                                    }}
                                    onKeyDown={handleKeydown}
                                />
                                <label htmlFor='password'> Password </label>
                                <button
                                    className='show-password-button'
                                    onClick={() => {
                                        setShowPassword(!showPassword);
                                        setIconType(showPassword ? FaLock : FaLockOpen); // This will Toggle the Icon
                                    }}
                                >
                                    <span className='password-icon'>{iconType}</span>
                                </button>
                            </div>
                            {/* {passwordError && <div className="error-message">{passwordError}</div>} */}
                            {/* End of Password */}
                        </div>
                        <div className='password'>
                            <div className='remember-me'>
                                <input
                                    type='checkbox'
                                    id='remember-me'
                                    checked={isRememberMeChecked}
                                    onChange={(e) => setIsRememberMeChecked(e.target.checked)}
                                />
                                <label htmlFor='remember-me'> Remember me </label>
                            </div>
                            <div className='forgot-password' onClick={handleForgotPassClick}>Forgot Password? </div>
                        </div>
                        {errorMsg && <div className="loginErrorMsg">{errorMsg}</div>}
                        {successMsg && <div className="loginErrorMsg">{successMsg}</div>}
                        <div className='submit-container'>
                            <button
                                className='submit'
                                onClick={() => {
                                    handleValidation();
                                    loginSubmit();
                                }}
                                onKeyDown={handleKeydown}
                            >Log In
                            </button>
                        </div>
                        <div className='footer'>
                            <a href=''> Terms of use </a>
                            |
                            <a href=''> Privacy Policy </a>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <ForgotPassModal onClose={() => setShowModal(false)} />}
        </>
    );
};

export default Login;