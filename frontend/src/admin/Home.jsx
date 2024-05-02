
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// CSS and Assets
import "./styles/Home.css";
import "./dashboard/styles/Employee.css";
import "./dashboard/styles/Home.css";
import logo from "../assets/homepage/final-topright-logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faThumbsUp,
  faChartLine,
  faChartBar,
  faUserTie,
  faAddressBook,
  faGraduationCap,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import defaultImg from "../assets/signed-in/defaultImg.png"
import Swal from 'sweetalert2';

// Import your other dashboard components here
import HomeDashboard from "./dashboard/HomeDashboard";
import PromotionDashboard from "./dashboard/EmployeePromotionDashboard";
import ApprovalDashboard from "./dashboard/EmployeeApproval";
import BasicInfoDashboard from "./dashboard/EmployeeBasicInfoDashboard";
import JobInfoDashboard from "./dashboard/EmployeeJobInfoDashboard";
import AccountInfoDashboard from "./dashboard/EmployeeAccountInfo";
import EduchistoryInfoDashboard from "./dashboard/EmployeeEducationHistory";
import JobhistoryInfoDashboard from "./dashboard/EmployeeJobHistory";

const Home = () => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(1); // Set default to 1 for Statistics
  const [showDropdown, setShowDropdown] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    setUserRole(role);

    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const userEmail = sessionStorage.getItem('email');
        const response = await fetch(`https://ccmps-server-node.vercel.app/api/auth/admin-profile?email=${userEmail}`);
        const data = await response.json();
        if (data.success) {
          // Set user name
          setUserName(data.userData.firstName);
          setUserImage(data.userData.image ? `data:image/jpeg;base64,${data.userData.image}` : userImage);
        } else {
          console.error('Failed to fetch user profile:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleClick = (index) => {
    setSelectedItem(index);
  };

  const renderDashboardComponent = () => {
    switch (selectedItem) {
      case 0:
        return <ApprovalDashboard />;
      case 1:
        return <HomeDashboard />;
      case 2:
        return <PromotionDashboard />;
      case 3:
        return <BasicInfoDashboard />;
      case 4:
        return <JobInfoDashboard />;
      case 5:
        return <AccountInfoDashboard />;
      case 6:
        return <EduchistoryInfoDashboard />;
      case 7:
        return <JobhistoryInfoDashboard />;
      default:
        return null;
    }
  };

  const renderMenuItems = () => {
    if (userRole === "HR Coordinator") {
      return (
        <>
          <li
            className={selectedItem === 1 ? "clicked" : ""}
            onClick={() => handleClick(1)}
          >
            <span className="icons">
              <FontAwesomeIcon icon={faChartBar} className="fa-icon" />
            </span>
            Home
          </li>
          <li
            className={selectedItem === 3 ? "clicked" : ""}
            onClick={() => handleClick(3)}
          >
            <span className="icons">
              <FontAwesomeIcon icon={faUser} className="fa-icon" />
            </span>
            Employee Basic Info
          </li>
          <li
            className={selectedItem === 6 ? "clicked" : ""}
            onClick={() => handleClick(6)}
          >
            <span className="icons">
              <FontAwesomeIcon icon={faGraduationCap} className="fa-icon" />
            </span>
            Employee Edu History
          </li>
          <li
            className={selectedItem === 7 ? "clicked" : ""}
            onClick={() => handleClick(7)}
          >
            <span className="icons">
              <FontAwesomeIcon icon={faBriefcase} className="fa-icon" />
            </span>
            Employee Job History
          </li>
          <li
            className={selectedItem === 4 ? "clicked" : ""}
            onClick={() => handleClick(4)}
          >
            <span className="icons">
              <FontAwesomeIcon icon={faUserTie} className="fa-icon" />
            </span>
            Employee Job Info
          </li>
          <li
            className={selectedItem === 5 ? "clicked" : ""}
            onClick={() => handleClick(5)}
          >
            <span className="icons">
              <FontAwesomeIcon icon={faAddressBook} className="fa-icon" />
            </span>
            Employee Account Info
          </li>
        </>
      );
    } else if (userRole === "HR Manager") {
      // Display all menu items
      return (
        <>
          {/* Render all menu items */}
          <li
            className={selectedItem === 1 ? "clicked" : ""}
            onClick={() => handleClick(1)}
          >
            <span className="icons">
              <FontAwesomeIcon icon={faChartBar} className="fa-icon" />
            </span>
            Home
          </li>
          <li
            className={selectedItem === 0 ? "clicked" : ""}
            onClick={() => handleClick(0)}
          >
            <span className="icons">
              <FontAwesomeIcon icon={faThumbsUp} className="fa-icon" />
            </span>
            Employee Approval
          </li>
          <li
            className={selectedItem === 2 ? "clicked" : ""}
            onClick={() => handleClick(2)}
          >
            <span className="icons">
              <FontAwesomeIcon icon={faChartLine} className="fa-icon" />
            </span>
            Employee Promotion
          </li>
          <li
            className={selectedItem === 3 ? "clicked" : ""}
            onClick={() => handleClick(3)}
          >
            <span className="icons">
              <FontAwesomeIcon icon={faUser} className="fa-icon" />
            </span>
            Employee Basic Info
          </li>
          <li
            className={selectedItem === 6 ? "clicked" : ""}
            onClick={() => handleClick(6)}
          >
            <span className="icons">
              <FontAwesomeIcon icon={faGraduationCap} className="fa-icon" />
            </span>
            Employee Edu History
          </li>
          <li
            className={selectedItem === 7 ? "clicked" : ""}
            onClick={() => handleClick(7)}
          >
            <span className="icons">
              <FontAwesomeIcon icon={faBriefcase} className="fa-icon" />
            </span>
            Employee Job History
          </li>
          <li
            className={selectedItem === 4 ? "clicked" : ""}
            onClick={() => handleClick(4)}
          >
            <span className="icons">
              <FontAwesomeIcon icon={faUserTie} className="fa-icon" />
            </span>
            Employee Job Info
          </li>
          <li
            className={selectedItem === 5 ? "clicked" : ""}
            onClick={() => handleClick(5)}
          >
            <span className="icons">
              <FontAwesomeIcon icon={faAddressBook} className="fa-icon" />
            </span>
            Employee Account Info
          </li>
        </>
      );
    } else {
      // For other roles, you can decide what to render
      return null;
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out'
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('role');
        navigate('/Admin');
      }
    });
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  }

  const DropdownModal = ({ logoutHandler }) => {
    return (
      <div className="dropdown-modal">
        <ul>
          <li><button onClick={logoutHandler}> Log Out </button></li>
        </ul>
      </div>
    );
  };

  return (
    <>
      <div className="admin-navbar">
        <div className='career-compass-logo'>
          <img src={logo} alt='career-compass-logo' className='career-compass-image' />
        </div>
        <div className="admin-profile-info">
          <img
            src={userImage || defaultImg} // if the image is not captured, it will revert to the default image
            alt='profile'
            className='profileImg'
          />
          <p className='username' onClick={toggleDropdown} > {userName} </p>
        </div>
      </div>
      <div className='parent-main-frame'>
        <section className='dashboard'>
          <div className='dashboard-content'>
            <ul>
              {/* Render menu items based on user role */}
              {renderMenuItems()}
            </ul>
          </div>
        </section>
        <section className='selected-content'>
          {/* Render the selected dashboard component */}
          {renderDashboardComponent()}
        </section>
      </div>
      {showDropdown && <DropdownModal logoutHandler={handleLogout} />}
    </>
  );
};


export default Home;
