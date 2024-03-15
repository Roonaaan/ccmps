import React, { useState } from "react";
import Forgotpassmessage from "./Forgotpassmessage";

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

    const handleValidation = () => {
        setEmailError('');

        if (!email) {
            setEmailError('Please enter your email address');
        } else if (!/\S+@\S+\.\S+/.test(email)) { // Basic email validation
            setEmailError('Please enter a valid email address');
        } else {
            emailSent();
        }
    }

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

    // Function to send reset email
    const emailSent = async () => {
        try {
            const response = await fetch ('http://localhost/CareerCompass/backend/login-page/forgot-password.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                messageSent(`${encodeURIComponent(email)}`);
            } else {

            }
        } catch (error) {
            console.error('An error occured', error);
        }
    };
    
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