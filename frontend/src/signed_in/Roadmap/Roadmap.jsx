import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ROADMAP CSS
import "./styles/style.css";

import logo from "../../assets/homepage/final-topright-logo.png";
import defaultImg from "../../assets/signed-in/defaultImg.jpg";

const Roadmap = () => {
  const [userImage, setUserImage] = useState("");
  const [userName, setUserName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [phase, setPhase] = useState(1); // Track current phase
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedJob, recommendedJobs } = location.state;

  const [doneOpacities, setDoneOpacities] = useState([100, 100, 100]);
  const [nextOpacity, setNextOpacity] = useState(50);


  const handleDoneClick = (index) => {
    const newOpacities = [...doneOpacities];
    newOpacities[index] = 50;
    setDoneOpacities(newOpacities);
    setNextOpacity(100);
  };


  const handleNextClick = () => {
    // Move to the next phase
    if (phase < 4) {
      setPhase(phase + 1);
    }
  };

  const handlePrevClick = () => {
    // Move to the previous phase
    if (phase > 1) {
      setPhase(phase - 1);
    }
  };


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

      {/* Progress Bar */}
      <section className="progressFrame">
        <div className="leftSide">
          <ul className="progressBarList">
            {recommendedJobs.map((_, index) => (
              <li
                key={index}
                className={`progressBarItem ${index + 1 === phase ? "currentItem" : ""}`}
              >
                <span className="phaseCount">{index + 1}</span>
                <span className="phaseProgressLabel">Phase {index + 1}</span>
              </li>
            ))}
          </ul>
          <div className="progressDescription"></div>
        </div>
      </section>

      {/* Middle Section */}
      <div className="middleSection">
        <section className="rightSide">
          <div className="rightsideTitle">
            {phase === 1 && "INTRODUCTION"}
          </div>
          {/* Your existing JSX for tasks */}
        </section>
      </div>
      {/* Footer Buttons */}
      <div className="button-section-footer">
        <button
          className="prev-button-footer"
          onClick={handlePrevClick}
          disabled={phase === 1}
          style={{ opacity: phase === 1 ? 0.5 : 1 }}
        >
          PREV PHASE
        </button>
        <button
          className="next-button-footer"
          onClick={handleNextClick}
          disabled={phase === recommendedJobs.length}
          style={{ opacity: phase === recommendedJobs.length ? 0.5 : 1 }}
        >
          NEXT PHASE
        </button>
      </div>      {showDropdown && <DropdownModal logoutHandler={handleLogout} />}
    </div>
  );
};

export default Roadmap;
