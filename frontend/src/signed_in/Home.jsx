import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import "./styles/Home.css"

// Images
import logo from "../assets/homepage/final-topright-logo.png";
import defaultImg from "../assets/signed-in/defaultImg.jpg"

const Home = () => {

  const [userImage, setUserImage] = useState('');
  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
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

  const handleProfileClick = () => {
    navigate('/My-Profile');
  }

  // Logout User
  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/');
  }

  const DropdownModal = ({ logoutHandler }) => {
    return (
      <div className="dropdown-modal">
        <div className="profile-info">
          <img
            src={userImage || defaultImg} // if the image is not captured, it will revert to the default image
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

  const handleRoadmapClick = () => {
    navigate('/Recommend');
  }
  return (
    <>
      <div className='parent'>
        <header className='navBar'>
          <div className='navBarInner'>
            <div className='navLogoContainer'>
              <img src={logo} alt="logo" className="navLogo" />
            </div>

            <div className='navProfile'>
              <img
                src={userImage || defaultImg}
                alt='profile'
                className='profileImg'
                onClick={toggleDropdown}
              />
            </div>
          </div>
        </header>

        <section className='createRoadmap'>
          <div className='headerText'>
            <p className='welcomeText'> Welcome to CareerCompass </p>
            <p className='clickText'> Click to create your own roadmap! </p>
          </div>

          <div className='buttonContainer'>
            <button
              className='createButton'
              onClick={handleRoadmapClick}
            > CREATE ROADMAP
            </button>
          </div>
        </section>
        {showDropdown && <DropdownModal logoutHandler={handleLogout} />}
      </div>

    </>
  )
}

export default Home;
