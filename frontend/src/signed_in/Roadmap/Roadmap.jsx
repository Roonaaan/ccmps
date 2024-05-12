import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Assets
import "./styles/style.css";
import logo from "../../assets/homepage/final-topright-logo-light.png";
import defaultImg from "../../assets/signed-in/defaultImg.jpg";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const Roadmap = () => {
  const [userImage, setUserImage] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [prevButtonDisabled, setPrevButtonDisabled] = useState(sessionStorage.getItem('prevButtonDisabled') === 'true');
  const [recommendedJobs, setRecommendJobs] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [phase, setPhase] = useState(1); // Track current phase
  const [maxPhase, setMaxPhase] = useState(1); // Default max phase
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Video Player and QA
  const [videoUrl, setVideoUrl] = useState(""); // New state to store video URL
  const [questions, setQuestions] = useState([]);
  const [courses, setCourses] = useState([]);

  // Phase auto set to 1
  useEffect(() => {
    // Ensure phase is always set to 1 when the component mounts or refreshes
    setPhase(1);
    sessionStorage.setItem('phase', '1');
  }, []);

  const confirmAssessment = async () => {
    const confirmPrompt = await Swal.fire({ // Use Swal.fire instead of just Swal
      title: "Confirmation",
      text: "The next one will be an examination. The assessment will take 20 minutes. Would you like to proceed?",
      icon: "info",
      showCancelButton: true, // Add this to show Cancel button
      confirmButtonText: "Proceed", // Specify confirm button text
    });

    if (confirmPrompt.isConfirmed) { 
      navigate('/Roadmap/Assessment');
    }
  };

  // Next Button
  const handleNextClick = async () => {
    // Move to the next phase
    if (phase < maxPhase) {
      const nextPhase = phase + 1;
      setPhase(nextPhase);
      sessionStorage.setItem('phase', nextPhase.toString());
      await savePhaseNumber(userEmail, nextPhase); // Save phase number to the database
      // Set previous button as disabled
      setPrevButtonDisabled(true);
      sessionStorage.setItem('prevButtonDisabled', 'true'); // Store the state in sessionStorage
    } else if (phase === maxPhase) { 
      await confirmAssessment(); 
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
      // Enable the previous button
      setPrevButtonDisabled(false);
      sessionStorage.setItem('prevButtonDisabled', 'false'); // Store the state in sessionStorage
    }
  };

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('prevButtonDisabled');
    };
  }, []);

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

        const response = await fetch(`http://localhost:8800/api/auth/max-phase?job=${encodeURIComponent(selectedJobTitle)}`);
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
        const response = await fetch(`http://localhost:8800/api/auth/assessments?job=${encodeURIComponent(selectedJobTitle)}&phase=${phase}`);
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

  // Courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Retrieve selected job title from session storage
        const selectedJobTitle = sessionStorage.getItem('selectedJobTitle');

        if (!selectedJobTitle) {
          console.error("No selected job title found in session storage");
          return;
        }

        // Fetch courses with selected job title as query parameter
        const response = await fetch(`http://localhost:8800/api/auth/courses?job=${encodeURIComponent(selectedJobTitle)}`);
        const data = await response.json();

        if (response.ok) {
          // Check if courses exist before setting state
          if (data.courses && data.courses.length > 0) {
            setCourses(data.courses);
          } else {
            console.log(`No courses found for job title ${selectedJobTitle}`);
            setCourses([]); // Reset courses if no courses found
          }
        } else {
          console.error("Failed to fetch courses");
        }
      } catch (error) {
        console.error("An error occurred while fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // Q&A Connection (Question)
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // Retrieve selected job title from session storage
        const selectedJobTitle = sessionStorage.getItem('selectedJobTitle');

        if (!selectedJobTitle) {
          console.error("No selected job title found in session storage");
          return;
        }

        // Fetch assessment questions with selected job title as a query parameter
        const response = await fetch(`http://localhost:8800/api/auth/questions?job=${encodeURIComponent(selectedJobTitle)}`);
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
  }, []);

  // Save Phase Number
  const savePhaseNumber = async () => {
    try {
      const userEmail = sessionStorage.getItem('user'); // Retrieve user's email from session storage
      const phase = sessionStorage.getItem('phase'); // Retrieve phase number from session storage
      const response = await fetch(`http://localhost:8800/api/auth/save-phase?email=${userEmail}&phase=${phase}`, {
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
      const response = await fetch(`http://localhost:8800/api/auth/get-phase?email=${userEmail}`);
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

  const handleHomeClick = () => {
    navigate('/Welcome')
  }

  const handleProfileClick = () => {
    navigate("/My-Profile");
  };

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

  const toggleCourseDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Dropdown
  const DropdownModal = ({ logoutHandler }) => {
    return (
      <div className="dropdown-modal">
        <li><button onClick={logoutHandler}> Log Out </button></li>
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

  return (
    <div className="roadmapWrapper">
      <header className='navBar'>
        <div className='navBarInner'>
          <div className='navLogoContainer'>
            <img src={logo} alt="logo" className="navLogo" onClick={handleHomeClick} />
          </div>
          <div className='homeNavProfile'>
            <div className="homeNavProfileButton">
              <button onClick={handleProfileClick}> My Profile </button>
            </div>
            <div className="homeNavProfileUser" onClick={toggleDropdown}>
              <img
                src={userImage || defaultImg}
                alt='profile'
                className='profileImg'
              />
              <p>{userName}</p>
            </div>
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
          {/* Conditional rendering for video component or assessment component */}
          {phase <= maxPhase && videoUrl && renderVideo()}
        </section>
        <section className="coursesSection">
          <h2 onClick={toggleCourseDropdown} style={{ cursor: 'pointer' }}>
            Related Online Courses with Certificates
            {isOpen ? <FontAwesomeIcon icon={faAngleUp} className="arrow" /> : <FontAwesomeIcon icon={faAngleDown} className="arrow" />}
          </h2>
          {/* Render fetched courses */}
          {isOpen && courses.length > 0 && (
            <ul>
              {courses.map((course, index) => (
                <li key={index}>
                  <a href={course.link}>{course.description}</a>
                </li>
              ))}
            </ul>
          )}
          {isOpen && courses.length === 0 && (
            <p>No courses found.</p>
          )}
        </section>
      </div>

      {/* Buttons */}
      <div className="button-section-footer">
        <button
          className="prev-button-footer"
          onClick={handlePrevClick}
          disabled={phase === 1 || prevButtonDisabled}
          style={{ opacity: phase === 1 || prevButtonDisabled ? 0.5 : 1 }}
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