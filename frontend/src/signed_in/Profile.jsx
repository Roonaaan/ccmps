import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./styles/Profile.css"

// Images
import logo from "../assets/homepage/final-topright-logo-light.png";
import defaultImg from "../assets/signed-in/defaultImg.jpg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone, faGears } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2';

const Profile = () => {
  const [userProfile, setUserProfile] = useState({ employmentHistory: [], educationalHistory: [] });
  const [userImage, setUserImage] = useState('');
  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBasicInfo, setShowBasicInfo] = useState(true);
  const [showEmployment, setShowEmployment] = useState(false);
  const [showEducation, setShowEducation] = useState(false);
  const navigate = useNavigate();


  // User Profile Connection
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userEmail = sessionStorage.getItem('user');
        if (userEmail) {
          const response = await axios.get(`http://localhost:8800/api/auth/user-details?email=${userEmail}`);
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

  // Profile Date Format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "green";
      case "Suspended":
      case "Terminated":
      case "Inactive":
        return "red";
      case "On Leave":
        return "blue";
      default:
        return "black";
    }
  };

  return (
    <>
      <div className="profileContainer">
        <header className="navBar">
          <div className="navBarInner">
            <div className="navLogoContainer">
              <img src={logo} alt="logo" className="navLogo" onClick={handleHomeClick} />
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
                  onClick={toggleDropdown}
                />
                <p>{userName}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="profileContainer">
          <div className="profileInnerContainer">
            <div className="profileInnerEmpPanel">
              <div className="profileInnerEmpPanelDetails">
                <div className="profileEmpImage">
                  <img src={userImage || defaultImg} alt="profile" />
                </div>
                <div className="profileEmpNameDetails">
                  <div className="profileEmpInfo">
                    <h1> {userProfile.firstName} {userProfile.lastName} </h1>
                  </div>
                  <div className="profileEmpInfo">
                    <ul className='empInfo'>
                      <li>
                        <div className="empInfo-title">Role </div>
                        :
                        <div className="empInfo-text"> {userProfile.jobPosition} </div>
                      </li>
                      <li>
                        <div className="empInfo-title">Employee ID </div>
                        :
                        <div className="empInfo-text"> {userProfile.employeeId} </div>
                      </li>
                      <li>
                        <div className="empInfo-title">Status </div>
                        :
                        <div className="empInfo-text" style={{ color: getStatusColor(userProfile.status) }}> {userProfile.status} </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profileInnerContainer">
            <div className="profileInnerBackgroundPanel">
              <div className="profileButtons">
                <button className={showBasicInfo ? 'activeButton' : ''} onClick={() => { setShowBasicInfo(true); setShowEmployment(false); setShowEducation(false); }}>Basic User Info</button>
                <button className={showEmployment ? 'activeButton' : ''} onClick={() => { setShowBasicInfo(false); setShowEmployment(true); setShowEducation(false); }}>Previous Work Employment</button>
                <button className={showEducation ? 'activeButton' : ''} onClick={() => { setShowBasicInfo(false); setShowEmployment(false); setShowEducation(true); }}>Education Background</button>
              </div>
              <div className="profileButtonUnderline" />
              <div className="profileInnerBackgroundPanelDetails">
                {showBasicInfo && (
                  <div className="profileBackgroundDetails">
                    <div className="profileBackgroundBasic">
                      <label htmlFor="info"> User Info </label>
                      <div className="profileBackgroundBasicInfo">
                        <ul className='basicInfo'>
                          <li>
                            <div className="basicInfo-title">Email </div>
                            :
                            <div className="basicInfo-text"> {userProfile.email} </div>
                          </li>
                          <li>
                            <div className="basicInfo-title">Phone Number </div>
                            :
                            <div className="basicInfo-text"> {userProfile.phoneNumber} </div>
                          </li>
                          <li>
                            <div className="basicInfo-title">Skills </div>
                            :
                            <div className="basicInfo-text"> {userProfile.skills} </div>
                          </li>
                        </ul>
                        <div class="profileButtonUnderline"></div>
                        <ul className='basicInfo'>
                          <li>
                            <div className="basicInfo-title">Age </div>
                            :
                            <div className="basicInfo-text"> {userProfile.age} </div>
                          </li>
                          <li>
                            <div className="basicInfo-title">Gender </div>
                            :
                            <div className="basicInfo-text"> {userProfile.gender} </div>
                          </li>
                          <li>
                            <div className="basicInfo-title">Nationality </div>
                            :
                            <div className="basicInfo-text"> {userProfile.nationality} </div>
                          </li>
                          <li>
                            <div className="basicInfo-title">Civil Status </div>
                            :
                            <div className="basicInfo-text"> {userProfile.civilStatus} </div>
                          </li>
                          <li>
                            <div className="basicInfo-title">Address </div>
                            :
                            <div className="basicInfo-text"> {userProfile.homeAddress} District {userProfile.district}, {userProfile.city}. {userProfile.postalCode} {userProfile.province}</div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                {showEmployment && (
                  <div className="profileBackgroundDetails">
                    <div className="profileBackgroundJob">
                      <label htmlFor="info">Previous Employment Info</label>
                      <div className="profileJobCardParent">
                        {userProfile.employmentHistory.map((job, index) => (
                          <div key={index} className="profileJobCardContainer">
                            <div className="profileJobCard">
                              <h1>{job.company}</h1>
                              <div className="profileCardContent">
                                <ul className='jobInfo'>
                                  <li>
                                    <div className="jobInfo-title">Address</div>:
                                    <div className="jobInfo-text">{job.companyAddress}</div>
                                  </li>
                                  <li>
                                    <div className="jobInfo-title">Job Title</div>:
                                    <div className="jobInfo-text">{job.jobTitle}</div>
                                  </li>
                                  <li>
                                    <div className="jobInfo-title">Start Date</div>:
                                    <div className="jobInfo-text">{new Date(job.startDate).toLocaleDateString()}</div>
                                  </li>
                                  <li>
                                    <div className="jobInfo-title">End Date</div>:
                                    <div className="jobInfo-text">{new Date(job.endDate).toLocaleDateString()}</div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {showEducation && (
                  <div className="profileBackgroundDetails">
                    {/* Render education background here */}
                    <p>Education Background</p>
                  </div>
                )}
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