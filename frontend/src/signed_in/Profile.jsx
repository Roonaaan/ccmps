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

  const [userProfile, setUserProfile] = useState({ employmentHistory: [], educationalHistory: [] });
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
          const response = await axios.get(`https://localhost:8800/api/auth/user-details?email=${userEmail}`);
          const userData = response.data.userProfile;
          // Update based on new userProfile structure
          setUserProfile(userData);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Consider displaying an error message to the user
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
          const response = await fetch(`https://localhost:8800/api/auth/user-profile?email=${userEmail}`);
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

  // Profile Date Format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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
                <h1> {userProfile.firstName} {userProfile.lastName} </h1> {/* FIRST AND LAST NAME */}
              </div>
              <div className="profileEmpNameDetails">
                <p> {userProfile.jobPosition} </p> {/* JOB_POSITION */}
              </div>
              <div className="profileEmpNameDetails">
                <p1> Employee # {userProfile.employeeId} </p1> {/* EMPLOYEE_ID */}
              </div>
            </div>
            <div className="underline" />
            <div className="profileEmpDetailContainer">
              <div className="profileEmpDetail">
                <p><FontAwesomeIcon icon={faEnvelope} /> {userProfile.email} </p> {/* EMAIL */}
              </div>
              <div className="profileEmpDetail">
                <p><FontAwesomeIcon icon={faPhone} /> {userProfile.phoneNumber} </p> {/* PHONE_NUMBER */}
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
                  <p1> {userProfile.age} </p1>
                </div>
                <div className="profileEmpPersonalInfo">
                  <p> Birthday: </p> {/* BIRTHDAY */}
                  <p1> {userProfile.birthday ? formatDate(userProfile.birthday) : ''} </p1>
                </div>
                <div className="profileEmpPersonalInfo">
                  <p> Gender: </p> {/* GENDER */}
                  <p1> {userProfile.gender} </p1>
                </div>
                <div className="profileEmpPersonalInfo">
                  <p> Nationality: </p> {/* NATIONALITY */}
                  <p1> {userProfile.nationality} </p1>
                </div>
                <div className="profileEmpPersonalInfo">
                  <p> Civil Status: </p> {/* CIVIL_STATUS */}
                  <p1> {userProfile.civilStatus} </p1>
                </div>
              </div>
            </div>
            {/* Employee Address */}
            <div className="profileEmpBackgroundAddressContainer">
              <label htmlFor="Address"> Address </label>
              <div className="profileEmpBackgroundAddress">
                <div className="profileEmpAddress">
                  <p> Home Address: </p> {/* HOME_ADDRESS */}
                  <p1> {userProfile.homeAddress} </p1>
                </div>
                <div className="profileEmpAddress">
                  <p> District: </p> {/* DISTRICT */}
                  <p1> {userProfile.district} </p1>
                </div>
                <div className="profileEmpAddress">
                  <p> City: </p> {/* CITY */}
                  <p1> {userProfile.city} </p1>
                </div>
                <div className="profileEmpAddress">
                  <p> Province: </p> {/* PROVINCE */}
                  <p1> {userProfile.province} </p1>
                </div>
                <div className="profileEmpAddress">
                  <p> Postal Code: </p> {/* POSTAL_CODE */}
                  <p1> {userProfile.postalCode} </p1>
                </div>
              </div>
            </div>
            {/* Employment History */}
            <div className="profileEmpBackgroundEmploymentHistoryContainer">
              <label htmlFor="empHistory"> Employment History </label>
              <div className="profileEmpBackgroundEmploymentHistory">
                {userProfile.employmentHistory &&
                  userProfile.employmentHistory
                    .filter(
                      (job, index, self) =>
                        index ===
                        self.findIndex(
                          (j) =>
                            j.company === job.company &&
                            j.jobTitle === job.jobTitle &&
                            j.companyAddress === job.companyAddress &&
                            j.startDate === job.startDate &&
                            j.endDate === job.endDate
                        )
                    )
                    .map((job, index) => (
                      <div className="profileEmpHistory" key={index}>
                        <div>
                          <p> Company: </p> {/* COMPANY */}
                          <p1> {job.company} </p1>
                        </div>
                        <div>
                          <p> Job Title: </p> {/* JOB_TITLE */}
                          <p1> {job.jobTitle} </p1>
                        </div>
                        <div>
                          <p> Address: </p> {/* COMPANY_ADDRESS */}
                          <p1> {job.companyAddress} </p1>
                        </div>
                        <div>
                          <p> Start Date: </p> {/* START_DATE */}
                          <p1> {job.startDate ? formatDate(job.startDate) : ''} </p1>
                        </div>
                        <div>
                          <p> End Date: </p> {/* END_DATE */}
                          <p1> {job.endDate ? formatDate(job.endDate) : ''} </p1>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
            {/* Educational Background */}
            <div className="profileEmpBackgroundEmploymentHistoryContainer">
              <label htmlFor="eduHistory"> Educational Background </label>
              <div className="profileEmpBackgroundEmploymentHistory">
                {userProfile.educationalHistory &&
                  userProfile.educationalHistory
                    // Filter out duplicate educational background records based on the school name
                    .filter(
                      (eduItem, index, self) =>
                        index ===
                        self.findIndex(
                          (t) => t.school === eduItem.school && t.yearGraduated === eduItem.yearGraduated
                        )
                    )
                    .map((eduItem, index) => (
                      <div className="profileEmpHistory" key={index}>
                        <div>
                          <p> Grade/Level: </p>
                          <p1> {eduItem.gradeLevel} </p1>
                        </div>
                        <div>
                          <p> School: </p>
                          <p1> {eduItem.school} </p1>
                        </div>
                        <div>
                          <p> Year Graduated: </p>
                          <p1> {eduItem.yearGraduated} </p1>
                        </div>
                      </div>
                    ))}
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