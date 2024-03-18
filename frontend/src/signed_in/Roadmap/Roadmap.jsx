import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ROADMAP CSS
import "./styles/style.css";

import logo from "../../assets/homepage/final-topright-logo.png";
import defaultImg from "../../assets/signed-in/defaultImg.jpg";

const Roadmap = () => {
  const [userImage, setUserImage] = useState("");
  const [userName, setUserName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  0
  const [doneOpacities, setDoneOpacities] = useState([100, 100, 100]);
  const [nextOpacity, setNextOpacity] = useState(50);


  const handleDoneClick = (index) => {
    const newOpacities = [...doneOpacities];
    newOpacities[index] = 50;
    setDoneOpacities(newOpacities);
    setNextOpacity(100);
  };


  const handleNextClick = () => {

  };


  // User Page Connection
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userEmail = sessionStorage.getItem('user');
        if (userEmail) {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/user-profile?email=${userEmail}`);
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
    navigate("/My-Profile");
  };

  // Logout User
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const DropdownModal = ({ logoutHandler }) => {
    return (
      <div className="dropdown-modal">
        <div className="profile-info">
          <img
            src={userImage || defaultImg}
            alt="profile"
            className="profileImg"
          />
          <p className="username">{userName}</p>
        </div>
        <ul>
          <li>
            <button onClick={handleProfileClick}> My Profile </button>
          </li>
          <li>
            <button onClick={logoutHandler}> Log Out </button>
          </li>
        </ul>
      </div>
    );
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="roadmapWrapper">
      {/* Navigation Bar */}
      <header className="navBar">
        <div className="navBarInner">
          <div className="navLogoContainer">
            <img src={logo} alt="logo" className="navLogo" />
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

      <section className="progressFrame">
        <div className="leftSide">
          <ul className="progressBarList  ">
            <li className="progressBarItem currentItem ">
              <span className="phaseCount ">1</span>
              <span className="phaseProgressLabel">Phase 1</span>
            </li>

            <li className="progressBarItem  ">
              <span className="phaseCount">2</span>
              <span className="phaseProgressLabel">Phase 2</span>
            </li>

            <li className="progressBarItem  ">
              <span className="phaseCount">3</span>
              <span className="phaseProgressLabel">Phase 3</span>
            </li>

            <li className="progressBarItem">
              <span className="phaseCount">4</span>
              <span className="phaseProgressLabel">Phase 4</span>
            </li>
          </ul>
          <div className="progressDescription"></div>
        </div>
      </section>

      {/* Middle Section */}
      <div className="middleSection">
        <section className="rightSide">
          <div className="rightsideTitle"> INTRODUCTION </div>
          <div className="taskDiv">
            <div className="taskTitle"> Task Title </div>
            <div className="taskDescription">
              {" "}
              Task Description: Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.{" "}
            </div>
            <div className="button-section">
              <button
                className="done-button"
                onClick={() => handleDoneClick(0)} // Pass index of this button
                style={{ opacity: `${doneOpacities[0]}%` }}
              >
                Done
              </button>
            </div>
          </div>
          <div className="taskDiv">
            <div className="taskTitle"> Task Title </div>
            <div className="taskDescription">
              {" "}
              Task Description: Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.{" "}
            </div>
            <div className="button-section">
              <button
                className="done-button1"
                onClick={() => handleDoneClick(1)} // Pass index of this button
                style={{ opacity: `${doneOpacities[1]}%` }}
              >
                Done
              </button>
            </div>
          </div>
          <div className="taskDiv">
            <div className="taskTitle"> Task Title </div>
            <div className="taskDescription">
              {" "}
              Task Description: Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.{" "}
            </div>
            <div className="button-section">
              <button
                className="done-button2"
                onClick={() => handleDoneClick(2)} // Pass index of this button
                style={{ opacity: `${doneOpacities[2]}%` }}
              >
                Done
              </button>
            </div>
          </div>
        </section>

        <div className="button-section-footer">
          <button className="prev-button-footer"> PREV PHASE </button>
          <button
            className="next-button-footer"
            onClick={handleNextClick}
            style={{ opacity: `${nextOpacity}%` }}
          >
            NEXT PHASE
          </button>

        </div>
      </div>
    </div>
  );
};

export default Roadmap;
