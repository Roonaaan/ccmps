import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/recommend.css';

// Images
import logo from "../../assets/homepage/final-topright-logo.png";
import defaultImg from "../../assets/signed-in/defaultImg.jpg";

const SelectDept = () => {
    const [userImage, setUserImage] = useState('');
    const [userName, setUserName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [showDescriptions, setShowDescriptions] = useState({
        job1: false,
        job2: false,
        job3: false,
        job4: false,
        job5: false,
        job6: false,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost/CareerCompass/backend/algorithm/selected.php'); // Replace with your PHP endpoint URL
            const data = await response.json(); // Parse JSON response
            setDepartments(data);
        };
        fetchData();
    }, []);


    // User Page Connection
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userEmail = sessionStorage.getItem('user');
                if (userEmail) {
                    const response = await fetch(`http://localhost:8800/api/auth/user-profile?email=${userEmail}`);
                    const data = await response.json();

                    if (data.success) {
                        setUserName(data.userData.firstName);
                        setUserImage(data.userData.image ? `data:image/jpeg;base64,${data.userData.image}` : userImage);
                    } else {
                        console.log('Failed to fetch user profile');
                    }
                }
            } catch (error) {
                console.error('An error occurred', error);
            }
        };

        fetchUserProfile();
    }, []);
    const handleProfileClick = () => {
        navigate('/My-Profile');
    }

    // Logout User
    const handleLogout = () => {
        sessionStorage.removeItem('user');
        navigate('/');
    }

    // Return to Home Page
    const handleHomeClick = () => {
        navigate('/Welcome')
    }

    const DropdownModal = ({ logoutHandler }) => {
        return (
            <div className="dropdown-modal">
                <div className="profile-info">
                    <img
                        src={userImage || defaultImg}
                        alt='profile'
                        className='profileImg'
                    />
                    <p className='username'>{userName}</p>
                </div>
                <ul>
                    <li><button onClick={handleProfileClick}> My Profile </button></li>
                    <li><button onClick={logoutHandler}> Log Out </button></li>
                </ul>
            </div>
        );
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    }

    const toggleDescription = (jobKey) => {
        setShowDescriptions({
            ...showDescriptions,
            [jobKey]: !showDescriptions[jobKey],
        });
    };

    return (
        <>
            <div className="selectedContainer">
                <header className="navBar">
                    <div className="navBarInner">
                        <div className="navLogoContainer">
                            <img src={logo} alt="logo" className="navLogo" onClick={handleHomeClick} />
                        </div>
                        <div className="navProfile">
                            <img
                                src={userImage || defaultImg}
                                alt="profile"
                                className="profileImg"
                                onClick={toggleDropdown}
                            />
                        </div>
                    </div>
                </header>

                <div className="selectedJobContainer">
                    <div className="selectedJobContainerInner">
                        <div className="selectedJobContainerHeader">
                            <h1> Selected Job Role </h1>
                        </div>
                        <div className="selectedJobContainerSubtitle">
                            <p> Select a role you want to achive. </p>
                        </div>
                        <div className="selectedJobContainerSelection">
                            {departments.map((department) => (
                                <div key={department.id} className="selectedJobContainerPanel" onClick={() => toggleDescription('job1')}>
                                    <p className='job-title'> {department.department} </p>
                                    <p className="job-description-selected">{department.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {showDropdown && <DropdownModal logoutHandler={handleLogout} />}
            </div>
        </>
    );
};

export default SelectDept;