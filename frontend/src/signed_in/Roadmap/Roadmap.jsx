import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import _ from 'lodash';

// ROADMAP CSS
import "./styles/style.css";

import logo from "../../assets/homepage/final-topright-logo.png";
import defaultImg from "../../assets/signed-in/defaultImg.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const Roadmap = () => {
  const [userImage, setUserImage] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [expandedDescriptions, setExpandedDescriptions] = useState([]);
  const [recommendedJobs, setRecommendJobs] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [phase, setPhase] = useState(1); // Track current phase
  const [maxPhase, setMaxPhase] = useState(1); // Default max phase number
  const navigate = useNavigate();

  // Video Player and QA
  const [videoUrl, setVideoUrl] = useState(""); // New state to store video URL
  const [questions, setQuestions] = useState([]);

  // Phase auto set to 1
  useEffect(() => {
    // Ensure phase is always set to 1 when the component mounts or refreshes
    setPhase(1);
    sessionStorage.setItem('phase', '1');
  }, []);

  // Next Button
  const handleNextClick = async () => {
    // Move to the next phase
    if (phase < maxPhase) {
      const nextPhase = phase + 1;
      setPhase(nextPhase);
      sessionStorage.setItem('phase', nextPhase.toString());
      await savePhaseNumber(userEmail, nextPhase); // Save phase number to the database
    }
  };

  // Previous Button
  const handlePrevClick = async () => {
    // Move to the previous phase
    if (phase > 1) {
      const prevPhase = phase - 1;
      setPhase(prevPhase);
      sessionStorage.setItem('phase', prevPhase.toString());
      await savePhaseNumber(userEmail, prevPhase); // Save phase number to the database
      // Filter out questions for the previous phase
      const filteredQuestions = questions.filter(question => question.phase === prevPhase);
      setQuestions(filteredQuestions);
    }
  };

  // Fetch Phase Number 
  useEffect(() => {
    // Fetch phase number when component mounts
    const fetchPhaseNumber = async () => {
      await getPhaseNumber(userEmail);
    };
    fetchPhaseNumber();
  }, [userEmail]);

  // Max Phase Connection
  useEffect(() => {
    const fetchMaxPhaseNumber = async () => {
      try {
        // Retrieve job position from session storage
        const selectedJobTitle = sessionStorage.getItem('selectedJobTitle');

        if (!selectedJobTitle) {
          console.error("No selected job title found in session storage");
          return;
        }

        const response = await fetch(`https://ccmps-server-node.vercel.app/api/auth/max-phase?job=${encodeURIComponent(selectedJobTitle)}`);
        const data = await response.json();
        setMaxPhase(data.maxPhaseNumber);
      } catch (error) {
        console.error("Error fetching max phase number:", error);
      }
    };

    fetchMaxPhaseNumber();
  }, []);

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
        const response = await fetch(`https://ccmps-server-node.vercel.app/api/auth/assessments?job=${encodeURIComponent(selectedJobTitle)}&phase=${phase}`);
        const data = await response.json();

        if (response.ok) {
          // Check if video URL exists for the current phase before setting state
          if (data.videoUrl) {
            setVideoUrl(data.videoUrl);
          } else {
            console.log(`No video found for phase ${phase}`);
            setVideoUrl(null); // Reset videoUrl if no video found
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
          console.log("Data received:", data); // Log data to inspect it
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

  // Save Phase Number
  const savePhaseNumber = async () => {
    try {
      const userEmail = sessionStorage.getItem('user'); // Retrieve user's email from session storage
      const phase = sessionStorage.getItem('phase'); // Retrieve phase number from session storage
      const response = await fetch(`https://ccmps-server-node.vercel.app/api/auth/save-phase?email=${userEmail}&phase=${phase}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Log success message
      } else {
        const errorData = await response.json();
        console.error(errorData.message); // Log error message
      }
    } catch (error) {
      console.error("Error saving phase number:", error);
    }
  }

  // Retrive Phase Number (Autosave Phase Number)
  const getPhaseNumber = async () => {
    try {
      const userEmail = sessionStorage.getItem('user'); // Retrieve user's email from session storage
      const response = await fetch(`https://ccmps-server-node.vercel.app/api/auth/get-phase?email=${userEmail}`);
      if (response.ok) {
        const data = await response.json();
        const phaseNumber = data.phaseNumber;
        console.log("Phase Number:", phaseNumber);
        setPhase(phaseNumber); // Set phase state based on the phase number fetched from the backend
        sessionStorage.setItem('phase', phaseNumber); // Store phase number in session storage
        // Handle routing to the phase based on phaseNumber if needed
      } else {
        const errorData = await response.json();
        console.error(errorData.message); // Log error message
      }
    } catch (error) {
      console.error("Error retrieving phase number:", error);
    }
  }

  const handleProfileClick = () => {
    navigate("/My-Profile");
  };

  // Logout User
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/");
  };

  // Dropdown
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
          height="315"
          allow="autoplay"
          allowFullScreen
          controls
        >
        </iframe>
      </div>
    );
  };

  // Render assessment questions
  const renderAssessments = () => {

    const groupedQuestions = _.groupBy(questions, 'description');

    const [selectedAnswers, setSelectedAnswers] = useState({}); // State to store selected answers
    const [answerStatus, setAnswerStatus] = useState([]);
    const [error, setError] = useState(null);

    // Retrieve user's email and position from session storage
    const email = sessionStorage.getItem('user');
    const position = sessionStorage.getItem('selectedJobTitle');
    const phase = parseInt(sessionStorage.getItem('phase'));


    // Submit Answers
    useEffect(() => {
      // Check if all questions have been answered
      const allQuestionsAnswered = questions.every(question => selectedAnswers[question.question_number]);

      if (allQuestionsAnswered) {
        let correctAnswers = 0;
        let updatedAnswerStatus = {};

        for (const question of questions) {
          const selectedAnswer = selectedAnswers[question.question_number];
          const isCorrect = selectedAnswer === question.correct_choice;

          correctAnswers += isCorrect ? 1 : 0;

          updatedAnswerStatus[question.question_number] = isCorrect;
        }

        setAnswerStatus(updatedAnswerStatus);
        setError(null); // Clear any previous error message
        console.log(`Correct answers: ${correctAnswers} out of ${questions.length}`);

        // Prepare data to send to the backend
        const dataToSend = {
          email,
          position,
          phase, // Include phase number
          answers: questions.map(question => ({
            description: question.description,
            question: question.question_number,
            answer: selectedAnswers[question.question_number],
            result: answerStatus[question.question_number] ? 'correct' : 'incorrect'
          }))
        };


        // Send data to the backend
        fetch('https://ccmps-server-node.vercel.app/api/auth/answers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to store answers');
            }
            return response.json();
          })
          .then(data => {
            console.log(data); // Log success message from the backend
          })
          .catch(error => {
            console.error('Error storing answers:', error);
          });
      } else {
        // Some questions are unanswered
        setError('Please answer all questions before moving to the next phase.');
      }
    }, [selectedAnswers, questions, email, position]);


    const userEmail = sessionStorage.getItem('user');
    const answersRetrieved = useRef(false); // Use useRef to track if answers have been retrieved
    if (userEmail && !answersRetrieved.current) {
      fetch(`https://ccmps-server-node.vercel.app/api/auth/retrieve-answers?email=${userEmail}`)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Failed to retrieve answers');
          }
        })
        .then(data => {
          const fetchedAnswers = data.answers || [];
          const updatedSelectedAnswers = { ...selectedAnswers }; // Copy existing selected answers
          fetchedAnswers.forEach(answer => {
            updatedSelectedAnswers[answer.question] = answer.answer; // Autofill answers for questions based on fetched data
          });
          setSelectedAnswers(updatedSelectedAnswers); // Update selected answers state
          answersRetrieved.current = true; // Set answersRetrieved to true after fetching answers
        })
        .catch(error => {
          console.error('Error retrieving answers:', error);
        });
    }


    const handleAnswerSelect = (questionNumber, answer) => {
      setSelectedAnswers({ ...selectedAnswers, [questionNumber]: answer });
      // Retrieve the correct answer for the current question
      const correctAnswer = questions.find(question => question.question_number === questionNumber).correct_choice;
      // Check if the selected answer matches the correct answer
      const isCorrect = answer === correctAnswer;
      // Update the answer status state
      setAnswerStatus({ ...answerStatus, [questionNumber]: isCorrect });
    };

    return (
      <div className="assessmentWrapper">
        {/* Error message for unanswered questions */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {Object.entries(groupedQuestions).map(([description, groupedQuestions]) => (
          <section key={description}>
            <h2>
              {description}{' '}
              <button className="dropdownAssessment" onClick={() => handleToggleDescription(description)}>
                {expandedDescriptions.includes(description) ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />}
              </button>
            </h2>
            {expandedDescriptions.includes(description) && (
              <ul style={{ display: expandedDescriptions.includes(description) ? 'block' : 'none' }}>
                {groupedQuestions.map((question, index) => (
                  <li key={index}>
                    <p>Q: {question.question_number}</p>
                    {/* Render multiple-choice options as radio buttons */}
                    <form>
                      {/* Check if 'options' property exists before accessing it */}
                      {question.options && (
                        <>
                          {Object.entries(question.options).map(([optionKey, optionValue]) => (
                            <label key={optionKey}>
                              <input
                                type="radio"
                                name={`question_${question.question_number}`}
                                value={optionKey.toUpperCase()} // Use uppercase letter as value
                                onChange={() => handleAnswerSelect(question.question_number, optionKey.toUpperCase())}
                                checked={selectedAnswers[question.question_number] === optionKey.toUpperCase()} // Set checked based on selected answer
                                disabled={answerStatus[question.question_number] !== undefined} // Disable radio buttons after submission
                              />
                              {optionValue}
                              {answerStatus[question.question_number] !== undefined && ( // Show feedback if answers have been submitted
                                <div>
                                  {selectedAnswers[question.question_number] === optionKey.toUpperCase() ? (
                                    // Display correct/incorrect feedback only for the selected answer
                                    answerStatus[question.question_number] ? (
                                      <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green' }} />
                                    ) : (
                                      <FontAwesomeIcon icon={faTimesCircle} style={{ color: 'red' }} />
                                    )
                                  ) : null}
                                </div>
                              )}
                            </label>
                          ))}
                        </>
                      )}
                    </form>
                  </li>
                ))}
              </ul>
            )}
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

      <section className="carousel-container">
        <div className="carousel-content">
          <div className="carousel-slide" style={{ transform: `translateX(-${(phase - 1) * 100}%)` }}>
            {Array.from({ length: maxPhase }, (_, index) => index + 1).map((num) => (
              <div key={num} className={`slide ${num === phase ? "active" : (num === phase - 1 || num === phase + 1) ? "neighbor" : ""}`}>
                <span className="phaseCount">{num}</span>
                <span className="phaseProgressLabel">Phase</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Middle Section */}
      <div className="middleSection">
        <section className="rightSide">
          {/* Render video component */}
          {videoUrl && renderVideo()}
          {/* Render assessment questions */}
          {questions && renderAssessments()}
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