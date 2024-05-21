import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/recommend.css';

// Images
import logo from "../../assets/homepage/final-topright-logo-light.png";
import defaultImg from "../../assets/signed-in/defaultImg.jpg";
import { TailSpin } from 'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const [loading, setLoading] = useState(true); // Initialize loading state as true
    const navigate = useNavigate();

    // User Page Connection
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userEmail = sessionStorage.getItem('user');
                if (userEmail) {
                    const response = await fetch(`https://ccmps-server-node.vercel.app/api/auth/user-profile?email=${userEmail}`);
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
                const response = await fetch(`https://ccmps-python.onrender.com/recommend?email=${userEmail}`);
                const data = await response.json();
                console.log('Fetched recommendations:', data); // Log the fetched data
                setRecommendedJobs(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
                setLoading(false);
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
        Swal.fire({
            title: 'Are you sure you want to log out?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, log out',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.removeItem('user');
                navigate('/');
                Swal.fire('Logged Out!', 'You have been logged out.', 'success');
            }
        });
    }

    // Return to Home Page
    const handleHomeClick = () => {
        navigate('/Welcome')
    }



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

    const handleJobClick = (job, index) => {
        setSelectedJob(index); // Store the index of the selected job
        // Store the title of the selected job in session storage
        sessionStorage.setItem('selectedJobTitle', job.title);
    }

    const DropdownModal = ({ logoutHandler }) => {
        return (
            <div className="dropdown-modal">
                <li><button onClick={logoutHandler}> Log Out </button></li>
            </div>
        );
    };

    // Retrieve the stored job object on component mount
    useEffect(() => {
        const storedJob = JSON.parse(sessionStorage.getItem('selectedJob'));
        if (storedJob) {
            setSelectedJob(storedJob);
        }
    }, []);

    const handleProceed = async () => {
        if (selectedJob !== null) {
            const selectedJobTitle = recommendedJobs[selectedJob].title; // Get the title of the selected job
            const userEmail = sessionStorage.getItem('user');

            try {
                const response = await fetch(`https://ccmps-server-node.vercel.app/api/auth/save-job?job=${encodeURIComponent(selectedJobTitle)}&email=${userEmail}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (response.ok) {
                    // Proceed to Roadmap if job selection saved successfully
                    navigate('/Roadmap', { state: { selectedJob, recommendedJobs } });
                } else {
                    // Handle error response
                    console.error('Failed to save job selection:', data.error);
                    toast.error('Failed to save job selection. Please try again.');
                }
            } catch (error) {
                console.error('An error occurred while saving job selection:', error);
                toast.error('An error occurred while saving job selection. Please try again later.');
            }
        } else {
            // Display toast message for "Please select a job first"
            toast.error('Please select a job before proceeding');
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="recommendContainer">
                <header className='navBar'>
                    <div className='navBarInner'>
                        <div className='navLogoContainer'>
                            <img src={logo} alt="logo" className="navLogo" onClick={handleHomeClick} />
                        </div>
                        <div className='homeNavProfile'>
                            <div className="homeNavProfileButton">
                                <button onClick={handleProfileClick}> My Profile </button>
                            </div>
                            <div className="homeNavProfileUser" onClick={toggleDropdown}>
                                <img
                                    src={userImage || defaultImg}
                                    alt='profile'
                                    className='profileImg'
                                />
                                <p>{userName}</p>
                            </div>
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
                            {loading ? ( // Render loader if loading state is true
                                <TailSpin
                                    visible={true}
                                    height="100"
                                    width="100"
                                    color="#27374D"
                                    ariaLabel="tail-spin-loading"
                                    radius="1"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                />
                            ) : (
                                recommendedJobs.map((job, index) => (
                                    <div
                                        key={index}
                                        className={`recommendJobContainerPanel ${selectedJob === index ? 'selected' : ''}`}
                                        onClick={() => {
                                            handleJobClick(job, index); // Pass the entire job object and its index
                                            toggleDescription(`job${index + 1}`);
                                        }}
                                    >
                                        <div>
                                            <p className='job-title'>{job.title} ({job.percentage}% )</p>
                                        </div>
                                        {showDescriptions[`job${index + 1}`] && (
                                            <div>
                                                <p className="job-description">{job.description}</p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
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
