import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./styles/Profile.css"

// Images
import logo from "../assets/homepage/final-topright-logo.png";
import defaultImg from "../assets/signed-in/defaultImg.jpg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'

const Profile = () => {

  const [userProfile, setUserProfile] = useState({})
  const [userImage, setUserImage] = useState('');
  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();


  // User Profile Connection
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userEmail = sessionStorage.getItem('user');

        if (userEmail) {
          const response = await axios.get(`http://localhost:8800/api/auth/user-details?email=${userEmail}`);
          const userData = response.data;

          if (userData.success) {
            setUserProfile(userData); // Store entire user profile data
            setUserName(`${userData.firstName} ${userData.lastName}`);
            setUserImage(userData.userImage || defaultImg);
          } else {
            console.log('Failed to fetch user profile');
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserDetails();
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

  return (
    <>
      <div className="profileContainer">
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

        <div className="profileInner">
          {/* Employee Profile */}
          <div className="profileEmpContainer">
            <div className="profileEmpImage">
              <img src={userImage || defaultImg} alt='profile' /> {/* IMAGE */}
            </div>
            <div className="profileEmpNameContainer">
              <div className="profileEmpNameDetails">
                <h1> user full name here </h1> {/* FIRST AND LAST NAME */}
              </div>
              <div className="profileEmpNameDetails">
                <p> job postition here </p> {/* JOB_POSITIN */}
              </div>
              <div className="profileEmpNameDetails">
                <p1> employee number  </p1> {/* EMPLOYEE_ID */}
              </div>
            </div>
            <div className="underline" />
            <div className="profileEmpDetailContainer">
              <div className="profileEmpDetail">
                <p><FontAwesomeIcon icon={faEnvelope} /> email here </p> {/* EMAIL */}
              </div>
              <div className="profileEmpDetail">
                <p><FontAwesomeIcon icon={faPhone} /> phone here </p> {/* PHONE_NUMBER */}
              </div>
            </div>
          </div>
          {/* Employee Background */}
          <div className="profileEmpBackgroundContainer">
            <div className="profileEmpBackgroundPersonalInfoContainer">
              <label htmlFor="personalInfo"> Personal Information </label>
              <div className="profileEmpBackgroundPersonalInfo">
                <div className="profileEmpPersonalInfo">
                  <p> Age: </p> {/* AGE */}
                  <p1> age here </p1>
                </div>
                <div className="profileEmpPersonalInfo">
                  <p> Birthday: </p> {/* BIRTHDAY */}
                  <p1> Birthday here </p1>
                </div>
                <div className="profileEmpPersonalInfo">
                  <p> Gender: </p> {/* GENDER */}
                  <p1> gender here </p1>
                </div>
                <div className="profileEmpPersonalInfo">
                  <p> Nationality: </p> {/* NATIONALITY */}
                  <p1> nationality here </p1>
                </div>
                <div className="profileEmpPersonalInfo">
                  <p> Civil Status: </p> {/* CIVIL_STATUS */}
                  <p1> civil status here </p1>
                </div>
              </div>
            </div>
            {/* Employee Address */}
            <div className="profileEmpBackgroundAddressContainer">
              <label htmlFor="Address"> Address </label>
              <div className="profileEmpBackgroundAddress">
                <div className="profileEmpAddress">
                  <p> Home Address: </p> {/* HOME_ADDRESS */}
                  <p1> home address here </p1>
                </div>
                <div className="profileEmpAddress">
                  <p> District: </p> {/* DISTRICT */}
                  <p1> district here </p1>
                </div>
                <div className="profileEmpAddress">
                  <p> City: </p> {/* CITY */}
                  <p1> city here </p1>
                </div>
                <div className="profileEmpAddress">
                  <p> Province: </p> {/* PROVINCE */}
                  <p1> province here </p1>
                </div>
                <div className="profileEmpAddress">
                  <p> Postal Code: </p> {/* POSTAL_CODE */}
                  <p1> postal code here </p1>
                </div>
              </div>
            </div>
            {/* Employment History */}
            <div className="profileEmpBackgroundEmploymentHistoryContainer">
              <label htmlFor="empHistory"> Employment History </label>
              <div className="profileEmpBackgroundEmploymentHistory">
                <div className="profileEmpHistory">
                  <p> Company: </p> {/* COMPANY */}
                  <p1> company here </p1>
                </div>
                <div className="profileEmpHistory">
                  <p> Job Title: </p> {/* JOB_TITLE */}
                  <p1> job title here </p1>
                </div>
                <div className="profileEmpHistory">
                  <p> Address: </p> {/* COMPANY_ADDRESS */}
                  <p1> company address here </p1>
                </div>
                <div className="profileEmpHistory">
                  <p> Start Date: </p> {/* START_DATE */}
                  <p1> start date here </p1>
                </div>
                <div className="profileEmpHistory">
                  <p> End Date: </p> {/* END_DATE */}
                  <p1> end date here </p1>
                </div>
              </div>
            </div>
            {/* Educational Background y */}
            <div className="profileEmpBackgroundEmploymentHistoryContainer">
              <label htmlFor="empHistory"> Educational Background </label>
              <div className="profileEmpBackgroundEmploymentHistory">
                <div className="profileEmpHistory">
                  <p> Grade/Level </p> {/* GRADE_LEVEL */}
                  <p1> grade level here </p1>
                </div>
                <div className="profileEmpHistory">
                  <p> School: </p> {/* SCHOOL */}
                  <p1> school here </p1>
                </div>
                <div className="profileEmpHistory">
                  <p> Year Graduated: </p> {/* YEAR_GRADUATE */}
                  <p1> year here </p1>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showDropdown && <DropdownModal logoutHandler={handleLogout} />}
      </div>
    </>
  );
}

export default Profile;