import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Swal from 'sweetalert2';
import img from '../../../assets/aboutus/ppRonan.jpg';

function PromotionReview({ onClose }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const employeeId = sessionStorage.getItem('editEmployeeId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://ccmps-server-node.vercel.app/api/auth/get-userpromotioninfo/${employeeId}`);
                const userData = response.data.userData;
                const score = parseFloat(userData.score);
                const promotionStatus = score >= 80 ? "Eligible for Promotion" : "Not Eligible for Promotion";

                // Convert Buffer image to base64
                const base64Image = arrayBufferToBase64(userData.image.data);
                userData.image = `data:image/jpeg;base64,${base64Image}`;

                setUserData({ ...userData, promotionStatus });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user promotion info:', error);
                // Handle error
            }
        };

        fetchData();
    }, [employeeId]); // Updated to include employeeId in dependency array

    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    const handlePromoteUser = async () => {
        if (userData.promotionStatus === "Eligible for Promotion") {
            try {
                const response = await axios.post(`https://ccmps-server-node.vercel.app/api/auth/promoteuser/${userData.employee_id}`);
                Swal.fire({
                    icon: 'success',
                    title: 'User Promoted',
                    text: response.data.message,
                });
                onClose(); // Close the promotion modal after promoting the user
            } catch (error) {
                console.error('Error promoting user:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Promote User',
                    text: 'An error occurred while promoting the user.',
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Not Eligible for Promotion',
                text: 'This user is not eligible for promotion!',
            });
        }
    };


    return (
        <>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="promotion-modal-overlay">
                    <div className="promotion-modal">
                        <h2>Review For Possible Promotion</h2>
                        <span className='close' onClick={onClose} >&times;</span>
                        <div className="promotionPanel">
                            <div className="promotionInner">
                                <div className="promotionInnerUser">
                                    <div className="promotionUserImage">
                                        <img src={userData.image || img} alt="user profile" style={{ width: '100px', height: '100px' }} />
                                    </div>
                                    <div className="promotionUserName">
                                        <h1>{userData.firstname} {userData.lastname}</h1>
                                        <p>{userData.job_position}</p>
                                        <p>Employee Number: {userData.employee_id}</p>
                                    </div>
                                </div>
                                <div className="promotionUserInfo">
                                    <label htmlFor="jobSelected"> Job Selected </label>
                                    <p>{userData.job_selected}</p>
                                    <label htmlFor="phase"> Current Phase Working </label>
                                    <p>{userData.current_phase}</p>
                                </div>
                                <div className="promotionStatus">
                                    <label htmlFor="promotion"> Promotion Status </label>
                                    <p>User Score: {userData.score}%</p>
                                    <p style={{ color: userData.promotionStatus === "Eligible for Promotion" ? 'green' : 'red' }}>{userData.promotionStatus}</p>
                                </div>
                                <div className="promotionButton">
                                    <button onClick={onClose}> Go Back </button>
                                    <button onClick={handlePromoteUser} disabled={userData.promotionStatus !== "Eligible for Promotion"}> Promote User </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PromotionReview;