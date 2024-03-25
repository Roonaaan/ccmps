import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import _ from 'lodash';

// ROADMAP CSS
import "./styles/style.css";

import logo from "../../assets/homepage/final-topright-logo.png";
import defaultImg from "../../assets/signed-in/defaultImg.jpg";

const Roadmap = () => {
  const [userImage, setUserImage] = useState("");
  const [userName, setUserName] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState([]);
  const [recommendedJobs, setRecommendJobs] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [phase, setPhase] = useState(1); // Track current phase
  const navigate = useNavigate();

  // Opacities
  const [doneOpacities, setDoneOpacities] = useState([100, 100, 100]);
  const [nextOpacity, setNextOpacity] = useState(50);

  // Video Player and QA
  const [videoUrl, setVideoUrl] = useState(""); // New state to store video URL
  const [questions, setQuestions] = useState([]);

  const handleDoneClick = (index) => {
    const newOpacities = [...doneOpacities];
    newOpacities[index] = 50;
    setDoneOpacities(newOpacities);
    setNextOpacity(100);
  };


  const handleNextClick = () => {
    // Move to the next phase
    if (phase < 4) {
      const nextPhase = phase + 1;
      setPhase(nextPhase);
      sessionStorage.setItem('phase', nextPhase.toString());
    }
  };

  const handlePrevClick = () => {
    // Move to the previous phase
    if (phase > 1) {
      const prevPhase = phase - 1;
      setPhase(prevPhase);
      sessionStorage.setItem('phase', prevPhase.toString());
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

  // Video Connection
  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        // Retrieve selected job title and phase from session storage
        const selectedJobTitle = sessionStorage.getItem('selectedJobTitle');
        const phase = sessionStorage.getItem('phase');

        if (!selectedJobTitle || !phase) {
          console.error("No selected job title or phase found in session storage");
          return;
        }

        // Fetch video URL with selected job title and phase as query parameters
        const response = await fetch(`http://localhost:8800/api/auth/assesments?job=${encodeURIComponent(selectedJobTitle)}&phase=${phase}`);
        const data = await response.json();

        if (response.ok) {
          // Check if video URL exists for the current phase before setting state
          if (data.videoUrl) {
            setVideoUrl(data.videoUrl);
          } else {
            console.log(`No video found for phase ${phase}`);
          }
        } else {
          console.error("Failed to fetch video URL");
        }
      } catch (error) {
        console.error("An error occurred while fetching video URL:", error);
      }
    };

    fetchVideoUrl();
  }, [phase]);

  // Q&A Connection
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Retrieve selected job title and phase from session storage
        const selectedJobTitle = sessionStorage.getItem('selectedJobTitle');
        const phase = sessionStorage.getItem('phase');

        if (!selectedJobTitle || !phase) {
          console.error("No selected job title or phase found in session storage");
          return;
        }

        // Fetch assessment questions with selected job title and phase as query parameters
        const response = await fetch(`http://localhost:8800/api/auth/questions?job=${encodeURIComponent(selectedJobTitle)}&phase=${phase}`);
        const data = await response.json();

        if (response.ok) {
          setQuestions(data.questions);
        } else {
          console.error("Failed to fetch assessment questions");
        }
      } catch (error) {
        console.error("An error occurred while fetching assessment questions:", error);
      }
    };

    fetchQuestions();
  }, [phase]);

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

  // Render the video component
  const renderVideo = () => {
    return (
      <div className="videoWrapper">
        <iframe
          width="560"
          height="315"
          src={videoUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  };

  // Render assessment questions
  const renderAssessments = () => {
    const groupedQuestions = _.groupBy(questions, 'description');

    return (
      <div className="assessmentWrapper">
        {Object.entries(groupedQuestions).map(([description, questions]) => (
          <section key={description}>
            <h2>
              {description}
              {/* Add toggle button for the dropdown */}
              <button className="expand-button" onClick={() => handleToggleDescription(description)}>
                {expandedDescriptions.includes(description) ? 'Collapse' : 'Expand'}
              </button>
            </h2>
            <ul style={{ display: expandedDescriptions.includes(description) ? 'block' : 'none' }}>
              {questions.map((question, index) => (
                <li key={index}>
                  <p>Q: {question.question_number}</p>
                  {/* Add text input for user's answer */}
                  <p>A: <input type="text" placeholder="Your Answer" /></p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    );
  };

  // Function to handle dropdown expansion/collapse
  const handleToggleDescription = (description) => {
    setExpandedDescriptions(prevExpandedDescriptions => {
      if (prevExpandedDescriptions.includes(description)) {
        return prevExpandedDescriptions.filter(d => d !== description);
      } else {
        return [...prevExpandedDescriptions, description];
      }
    });
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
          <ul className="progressBarList">
            {[1, 2, 3, 4].map((num) => (
              <li
                key={num}
                className={`progressBarItem ${num === phase ? "currentItem" : ""}`}
              >
                <span className="phaseCount">{num}</span>
                <span className="phaseProgressLabel">Phase {num}</span>
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
            {/* Display title based on phase */}
            {phase === 1}
          </div>
          {/* Render video component on every odd phase */}
          {phase % 2 === 1 && videoUrl && renderVideo()}
          {/* Render assessment questions on even phases */}
          {phase % 2 === 0 && questions && renderAssessments()}
        </section>
      </div>
      {/* Buttons */}
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
      </div>
      {showDropdown && <DropdownModal logoutHandler={handleLogout} />}
    </div>
  );
};

export default Roadmap;