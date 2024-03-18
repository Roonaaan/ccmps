import React, { useState } from "react";
import Forgotpassmessage from "./Forgotpassmessage";
import axios from 'axios';

// CSS
import './styles/Forgotpassword.css'

// Logo
import Logo from '../../assets/login/logo-dark.png'


export const Forgotpass = ({ onClose }) => {

    // Email Validation
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    // Modals
    const [showModal, setShowModal] = useState(false);

    // Reset Password Connection
    const handleValidation = async () => {
        setEmailError('');

        if (!email) {
            setEmailError('Please enter your email address');
        } else if (!/\S+@\S+\.\S+/.test(email)) { // Basic email validation
            setEmailError('Please enter a valid email address');
        } else {
            try {
                const response = await axios.post('http://localhost:8800/api/auth/reset-password', { email });
                const data = response.data;

                if (data.success) {
                    messageSent();
                } else {
                    console.error('Failed to send reset email:', data.message);
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        }
    };

    // Open Modal
    const messageSent = () => {
        setShowModal(true);
    }

    // Enter Event Key (Press enter)
    const handleKeydown = (event) => {
        if(event.key === 'Enter'){
            handleValidation();
        }
    };

    const handleInputChange = () => {
        setEmailError('');
    }

    return (
        <>
            <div className="forgot-password-modal">
            <div className="forgot-password-content">
                <span className="forgot-close" onClick={onClose}>&times;</span>
                <div className="imageHeader">
                    <img src={Logo} alt='Logo' className='imageHeaderLogo' />
                </div>
                <div className="forgotPassHeader">
                    <div className="forgotPassHeaderTitle"> Reset your Password </div>
                </div>
                <div className="forgotPassHeaderText"> Enter your email address and we will send you instructions to reset your password </div>
                <div className={`inputs ${emailError ? 'shakeError' : ''}`}>
                    <div className="input">
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
                    {/* {emailError && <div className='forgotErrorMsg'>{emailError} </div>} */}
                </div>
                <div className="forgotSubmit-container">
                    <button
                        className='forgotSubmit'
                        onClick={handleValidation}
                    > Continue
                    </button>
                </div>
                <div className="return">
                    <button className="return-submit" onClick={onClose}> Click here to return to Login </button>
                </div>
                <div className='footer-forgotPass'>
                    <a href=''> Terms of use </a>
                    |
                    <a href=''> Privacy Policy </a>
                </div>
            </div>
        </div>
        {showModal && <Forgotpassmessage onClose={() => setShowModal(false)} email={email} />}
        </>
    )
}

export default Forgotpass;