import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/recommend.css';

// Images
import logo from "../../assets/homepage/final-topright-logo.png";
import defaultImg from "../../assets/signed-in/defaultImg.jpg";

const Recommend = () => {
    const [userImage, setUserImage] = useState('');
    const [userName, setUserName] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDescriptions, setShowDescriptions] = useState({
        job1: false,
        job2: false,
        job3: false,
    });
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const navigate = useNavigate();

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

    // React to Python Connection
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const userEmail = sessionStorage.getItem('user');
                const response = await fetch(`http://localhost:5000/recommend?email=${userEmail}`);
                const data = await response.json();
                console.log('Fetched recommendations:', data); // Log the fetched data
                setRecommendedJobs(data);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        fetchRecommendations();
    }, []);

    console.log('Recommended jobs:', recommendedJobs);

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

    const handleSelectClick = () => {
        navigate('/Select-Department');
    }

    const handleJobClick = (jobIndex) => {
        setSelectedJob(jobIndex);
    }

    const handleProceed = () => {
        if (selectedJob !== null) {
            navigate('/Roadmap', { state: { selectedJob, recommendedJobs } }); // Pass selected job and recommended jobs to Roadmap
        } else {
            alert('Please select a job before proceeding');
        }
    }

    return (
        <>
            <div className="recommendContainer">
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

                <div className="recommendJobContainer">
                    <div className="recommendJobContainerInner">
                        <div className="recommendJobContainerHeader">
                            <h1> Recommended Job Role </h1>
                        </div>
                        <div className="recommendJobContainerSubtitle">
                            <p> Top 3 recommended job roles for you based on your profile </p>
                        </div>
                        <div className="recommendJobContainerSelection">
                            {recommendedJobs.map((job, index) => (
                                <div
                                    key={index}
                                    className={`recommendJobContainerPanel ${selectedJob === index ? 'selected' : ''}`}
                                    onClick={() => {
                                        handleJobClick(index);
                                        toggleDescription(`job${index + 1}`);
                                    }}
                                >
                                    <p className='job-title'>{job.title}</p>
                                    {showDescriptions[`job${index + 1}`] && <p className="job-description">{job.description}</p>}
                                </div>
                            ))}
                        </div>
                        <div className="recommendJobContainerButton">
                            <button className='recommendJobContainerProceed' onClick={handleProceed}> PROCEED </button>
                        </div>
                        <span onClick={handleSelectClick}> Want to choose your own job position, click here </span>
                    </div>
                </div>
                {showDropdown && <DropdownModal logoutHandler={handleLogout} />}
            </div>
        </>
    );
};

export default Recommend;