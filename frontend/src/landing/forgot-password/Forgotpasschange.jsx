import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Assets
import './styles/Forgotpassword.css'
import Logo from '../../assets/login/logo-light.png'
import Swal from 'sweetalert2';

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

            const response = await fetch('http://localhost:8800/api/auth/reset-userpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: token,
                    newPassword: newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Password Changed Successfully',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    navigate('/');
                });
            } else {
                setPasswordError(data.message);
            }
        } catch (error) {
            console.error('An error occurred', error);
        }
    }

    // Enter Event Key (Press enter)
    const handleKeydown = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <>
            <div className="forgotPassContainer">
                <div className="forgotPassInner">
                    <div className="imageHeader">
                        <img src={Logo} alt='Logo' className='imageHeaderLogo' />
                    </div>
                    <div className="forgotPassHeaderContainer">
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
                </div>
            </div>
        </>
    )
}

export default Forgotpasschange;