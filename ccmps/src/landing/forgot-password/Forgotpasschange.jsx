import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// CSS
import './styles/Forgotpassword.css'

// Logo
import Logo from '../../assets/login/logo-dark.png'

export const Forgotpasschange = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleChangePassword = (e) => {
        setNewPassword(e.target.value);
        setPasswordError('');
    }

    const handleChangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        setPasswordError('');
    }

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost/CareerCompass/backend/login-page/reset-password.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    newPassword: newPassword
                })
            });

            const data = await response.json();

            if (!data.success) {
                setPasswordError('Incorrect Current Password');
                return;
            }

            if (newPassword.length < 8) {
                setPasswordError('Password must be at least 8 characters long');
            } else if (!/[A-Z]/.test(newPassword)) {
                setPasswordError('Password must contain at least one uppercase letter');
            } else if (!/[a-z]/.test(newPassword)) {
                setPasswordError('Password must contain at least one lowercase letter');
            } else if (!/[0-9]/.test(newPassword)) {
                setPasswordError('Password must contain at least one number');
            } else if (!/[^\w\s]/.test(newPassword)) {
                setPasswordError('Password must contain at least one special character');
            } else if (newPassword !== confirmPassword) {
                setPasswordError('Passwords do not match');
                return;
            }

            if (data.success) {
                setPasswordError(<span style={{ color: 'green' }}> Password Successfully Changed </span>);
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('An error occurred', error);
        }
    }

    // Enter Event Key (Press enter)
    const handleKeydown = (event) => {
        if(event.key === 'Enter'){
            handleSubmit();
        }
    };

    return (
        <>
            <div className="imageHeader">
                <img src={Logo} alt='Logo' className='imageHeaderLogo' />
            </div>
            <div className="headerContainer">
                <div className="forgotPassHeader">
                    <div className="forgotPassHeaderTitle"> Change your Password </div>
                </div>
                <div className="forgotPassHeaderText"> Enter your new password below </div>
                <div className="inputs">
                    <div className="input">
                        <input
                            type='password'
                            placeholder=''
                            value={newPassword}
                            onChange={handleChangePassword}
                            onKeyDown={handleKeydown}
                        />
                        <label htmlFor='password'> New Password </label>
                    </div>
                    <div className="input">
                        <input
                            type='password'
                            placeholder=''
                            value={confirmPassword}
                            onChange={handleChangeConfirmPassword}
                            onKeyDown={handleKeydown}
                        />
                        <label htmlFor='password'> Confirm New Password </label>
                    </div>
                </div>
                {passwordError && <div className="changePassErrorMsg">{passwordError}</div>}             
                <div className='changePassSubmit'>
                    <button
                        className='submit'
                        onClick={handleSubmit}
                    > Change Password
                    </button>
                </div>
            </div>
        </>
    )
}

export default Forgotpasschange;