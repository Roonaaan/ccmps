import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

// Assets
import "./styles/Home.css"
import { TailSpin } from 'react-loader-spinner'
import Swal from 'sweetalert2';
import logo from "../assets/homepage/final-topright-logo-light.png";
import defaultImg from "../assets/signed-in/defaultImg.jpg"

const Home = () => {

  const [userImage, setUserImage] = useState('');
  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasSelectedJob, setHasSelectedJob] = useState(false); // Track if user has selected a job
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // User Page Connection
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userEmail = sessionStorage.getItem('user');
        if (userEmail) {
          const response = await fetch(`http://localhost:8800/api/auth/user-profile?email=${userEmail}`);
          const data = await response.json();
          setLoading(false);

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

  // Fetch User Job Connection
  useEffect(() => {
    const checkUserJob = async () => {
      try {
        const userEmail = sessionStorage.getItem('user');
        if (userEmail) {
          const response = await fetch(`http://localhost:8800/api/auth/get-job?email=${userEmail}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user job');
          }
          const data = await response.json();

          if (data.jobSelected) {
            setHasSelectedJob(true);
            sessionStorage.setItem('selectedJobTitle', data.jobTitle); // Store the job title in session storage
          } else {
            setHasSelectedJob(false);
            sessionStorage.removeItem('selectedJobTitle'); // Remove the job title from session storage if no job is selected
          }
        }
      } catch (error) {
        console.error('An error occurred', error);
      }
    };

    checkUserJob();
  }, []);

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

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

  const DropdownModal = ({ logoutHandler }) => {
    return (
      <div className="dropdown-modal">
        <li><button onClick={logoutHandler}> Log Out </button></li>
      </div>
    );
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  }

  const handleRoadmapClick = () => {
    if (hasSelectedJob) {
      // If user has selected a job, directly navigate to the roadmap
      navigate('/Roadmap'); // Assuming the route to the roadmap is '/Roadmap'
    } else {
      // If user hasn't selected a job, navigate to the job selection page
      navigate('/Recommend');
    }
  }

  return (
    <>
      <div className='parent'>
        <header className='navBar'>
          <div className='navBarInner'>
            <div className='navLogoContainer'>
              <img src={logo} alt="logo" className="navLogo" />
            </div>
            <div className='homeNavProfile'>
              <div className="homeNavProfileButton">
                <button onClick={handleProfileClick}> My Profile </button>
              </div>
              <div className="homeNavProfileUser">
                <img
                  src={userImage || defaultImg}
                  alt='profile'
                  className='profileImg'
                />
                <p onClick={toggleDropdown}>{userName}</p>
              </div>
            </div>
          </div>

        </header>

        <section className='createRoadmap'>
          <div className='headerText'>
            <p className='welcomeText'> Welcome to CareerCompass </p>
            <p className='clickText'>{hasSelectedJob ? 'Continue on your progress' : 'Click to create your own roadmap!'}</p>
          </div>

          <div className='buttonContainer'>
            {loading ? ( // Render loader if loading state is true
              <TailSpin
                visible={true}
                height="100"
                width="100"
                color="#27374D"
                ariaLabel="tail-spin-loading"
                radius="1"
                animationDuration={2000}
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : (
              <button
                className='createButton'
                onClick={handleRoadmapClick}
              >{hasSelectedJob ? 'CONTINUE PROGRESS' : 'CREATE ROADMAP'}
              </button>
            )}
          </div>
        </section>
        {showDropdown && <DropdownModal logoutHandler={handleLogout} />}
      </div>

    </>
  )
}


export default Home;
