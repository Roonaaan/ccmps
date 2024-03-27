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

  // Video Player and QA
  const [videoUrl, setVideoUrl] = useState(""); // New state to store video URL
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState('');
  {/* const [videoEnded, setVideoEnded] = useState(false); */ } // Track if video has ended (just remove the bracket)

  useEffect(() => {
    // Ensure phase is always set to 1 when the component mounts or refreshes
    setPhase(1);
    sessionStorage.setItem('phase', '1');
  }, []);

  const handleNextClick = () => {
    // Move to the next phase
    if (phase < 4) {
      const nextPhase = phase + 1;
      setPhase(nextPhase);
      sessionStorage.setItem('phase', nextPhase.toString());
      {/* setVideoEnded(false); */ } // Button is unclickble unless the video is done
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
          const response = await fetch(`https://ccmps-server-node.vercel.app/api/auth/user-profile?email=${userEmail}`);
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
        const response = await fetch(`https://ccmps-server-node.vercel.app/api/auth/assesments?job=${encodeURIComponent(selectedJobTitle)}&phase=${phase}`);
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

  // Q&A Connection (Question)
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
        const response = await fetch(`https://ccmps-server-node.vercel.app/api/auth/questions?job=${encodeURIComponent(selectedJobTitle)}&phase=${phase}`);
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

  // Function to submit answers
  const submitAnswers = async () => {
    // Check if all questions are answered
    const unansweredQuestions = questions.filter(question =>
      !answers.find(answer => answer.question_number === question.question_number)
    );

    if (unansweredQuestions.length > 0) {
      // Set error message and highlight unanswered questions
      setError('Please answer all of the questions');
      return;
    }

    try {
      // Send POST request to submit answers
      const response = await fetch('https://ccmps-server-node.vercel.app/api/auth/submit-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })
      });

      // Check if the request was successful
      if (response.ok) {
        // Parse the response JSON
        const data = await response.json();
        console.log('Correct Answers:', data.correctAnswers);
        // Optionally, you can handle the correct answers received from the backend
      } else {
        // Handle errors if the request fails
        console.error('Failed to submit answers. Status:', response.status);
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      // Optionally, you can handle other errors here
    }
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
          src={videoUrl}
          width="560" 
          height="319" 
          allow="autoplay"
          >
        </iframe>
      </div>
    );
    {/* onEnded={() => setVideoEnded(true)} */ } //button is unclickble unless the video is done (add it below the "allowFullScreen")
  };


  // Render assessment questions
  const renderAssessments = () => {
    const groupedQuestions = _.groupBy(questions, 'description');

    return (
      <div className="assessmentWrapper">
        {Object.entries(groupedQuestions).map(([description, groupedQuestions]) => (
          <section key={description}>
            <h2>{description}</h2>
            <ul>
              {groupedQuestions.map((question, index) => (
                <li key={index}>
                  <p>Q: {question.question_number}</p>
                  <p>
                    A: <input
                      type="text"
                      placeholder="Your Answer"
                      onChange={(e) => {
                        const newAnswers = [...answers];
                        const answerIndex = newAnswers.findIndex(ans => ans.question_number === question.question_number);
                        if (answerIndex !== -1) {
                          newAnswers[answerIndex] = { question_number: question.question_number, answer: e.target.value };
                        } else {
                          newAnswers.push({ question_number: question.question_number, answer: e.target.value });
                        }
                        setAnswers(newAnswers);
                      }}
                    />
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {/* Error message for unanswered questions */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {/* Add button to submit answers */}
        <button onClick={submitAnswers}>Submit Answers</button>
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
      {/* 
      **Remove the Comment and replace the Buttons. This enables to click the "Next Phase" button onced the video is done**
      <div className="button-section-footer">
        <button
          className="prev-button-footer"
          onClick={handlePrevClick}
          disabled={phase === 1 || phase % 2 === 0} // Disable previous button on assessment phases
          style={{ opacity: (phase === 1 || phase % 2 === 0) ? 0.5 : 1 }}
        >
          PREV PHASE
        </button>
        <button
          className="next-button-footer"
          onClick={handleNextClick}
          disabled={(phase === 4 && !videoEnded) || (phase % 2 === 0)} // Disable next button on assessment phases and when video not ended
          style={{ opacity: ((phase === 4 && !videoEnded) || (phase % 2 === 0)) ? 0.5 : 1 }}
        >
        NEXT PHASE
        </button>
      </div>
      */}
      {showDropdown && <DropdownModal logoutHandler={handleLogout} />}
    </div>
  );
};

export default Roadmap;