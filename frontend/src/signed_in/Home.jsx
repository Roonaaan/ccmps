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
          const response = await fetch(`https://ccmps-server-node.vercel.app/api/auth/user-profile?email=${userEmail}`);
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
          const response = await fetch(`https://ccmps-server-node.vercel.app/api/auth/get-job?email=${userEmail}`);
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

  // Open Roadmap/Select Career
  const handleRoadmapClick = async () => {
    try {
      const userEmail = sessionStorage.getItem('user');
      const selectedJobTitle = sessionStorage.getItem('selectedJobTitle');

      // Check if there is a score
      const response = await fetch(`https://ccmps-server-node.vercel.app/api/auth/check-score?email=${userEmail}`);
      const data = await response.json();

      if (selectedJobTitle) {
        if (data.success && data.message === "There is a Data inside") {
          if (data.score !== null) {
            Swal.fire({
              title: 'Your Answers are being processed',
              text: 'Please wait for at least 2-3 business days',
              icon: 'info',
              confirmButtonText: 'OK'
            });
          } else if (data.remainingDays !== null) {
            Swal.fire({
              title: `You cannot access the roadmap for ${data.remainingDays} days`,
              text: 'Please wait until your restriction period ends',
              icon: 'warning',
              confirmButtonText: 'OK'
            });
          } else {
            navigate('/Roadmap'); // Navigate to '/Roadmap' if job is selected but no score restriction and no remainingDays
          }
        }
      } else {
        // If there's no selected job title
        if (data.success && data.message === "There is a Data inside") {
          if (data.remainingDays !== null) {
            Swal.fire({
              title: `You cannot access the roadmap for ${data.remainingDays} days`,
              text: 'Please wait until your restriction period ends',
              icon: 'warning',
              confirmButtonText: 'OK'
            });
          } else {
            navigate('/Recommend'); // Navigate to '/Recommend' if no job is selected and no remainingDays
          }
        } else {
          navigate('/Recommend'); // Navigate to '/Recommend' if no job is selected and no data inside
        }
      }
    } catch (error) {
      console.error('An error occurred while checking score:', error);
    }
  };

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