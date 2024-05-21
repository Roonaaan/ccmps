import React, { useState, useEffect } from "react";
import Forgotpassmessage from "./Forgotpassmessage";

// CSS
import './styles/Forgotpassword.css'

// Logo
import Logo from '../../assets/login/logo-light.png'


export const Forgotpass = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        setServerError('');
    }, [email]);

    const handleValidation = async () => {
        setEmailError('');

        if (!email) {
            setEmailError('Please enter your email address');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('https://ccmps-server-node.vercel.app/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            if (response.ok) {
                setShowModal(true);
                messageSent(`${encodeURIComponent(email)}`);
            } else {
                const data = await response.json();
                setServerError(data.message);
            }
        } catch (error) {
            console.error('Error sending reset password email:', error);
            setServerError('An error occurred while sending the reset password email');
        } finally {
            setLoading(false);
        }
    };

    // Open Modal
    const messageSent = () => {
        setShowModal(true);
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor='email'> Email Address </label>
                        </div>
                        {emailError && <div className='forgotErrorMsg'>{emailError} </div>}
                        {serverError && <div className='forgotErrorMsg'>{serverError} </div>}
                    </div>
                    <div className="forgotSubmit-container">
                        <button
                            className='forgotSubmit'
                            onClick={handleValidation}
                            disabled={loading}
                        >{loading ? 'Sending...' : 'Continue'}
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