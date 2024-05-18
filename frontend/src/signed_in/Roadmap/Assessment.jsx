import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Assets
import "./styles/style.css";
import logo from "../../assets/homepage/final-topright-logo-light.png";
import defaultImg from "../../assets/signed-in/defaultImg.jpg";
import Swal from "sweetalert2";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Assessment = () => {
    const [userImage, setUserImage] = useState("");
    const [userName, setUserName] = useState("");
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [remainingTime, setRemainingTime] = useState(1200); // 20 minutes
    const navigate = useNavigate();

    // Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (remainingTime === 0) {
            navigate('/Roadmap');
        }
    }, [remainingTime, navigate]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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

    // Fetch Assessment Questions
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
                const response = await fetch(`https://ccmps-server-node.vercel.app/api/auth/questions?job=${encodeURIComponent(selectedJobTitle)}`);
                const data = await response.json();

                if (response.ok) {
                    console.log("Data received:", data); // Log data to inspect it
                    // Shuffle the questions
                    const shuffledQuestions = shuffleArray(data.questions);
                    setQuestions(shuffledQuestions);
                } else {
                    console.error("Failed to fetch assessment questions");
                }
            } catch (error) {
                console.error("An error occurred while fetching assessment questions:", error);
            }
        };

        fetchQuestions();
    }, []);

    const handleHomeClick = () => {
        navigate('/Welcome')
    }

    const handleProfileClick = () => {
        navigate("/My-Profile");
    };

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

    const shuffleArray = (array) => {
        const shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        } else {
            // Reset currentQuestionIndex after showing the final message
            setCurrentQuestionIndex(0);
        }
    };

    const handleOptionChange = (e) => {
        setSelectedAnswer(e.target.value);
    };

    // Store Answer to the Database for later Calculation
    const checkAnswer = async () => {
        try {
            // Disable the button to prevent multiple submissions
            setIsSubmitting(true);

            if (!selectedAnswer) {
                // If no answer is selected, display a toast message
                toast.error("Please select your answer");
                setIsSubmitting(false);
                return;
            }

            const currentQuestion = questions[currentQuestionIndex];
            const correctAnswer = currentQuestion.correct_choice;

            console.log("Selected answer:", selectedAnswer);
            console.log("Correct answer:", correctAnswer);

            // Get the letter of the selected answer
            const selectedOption = Object.entries(currentQuestion.options).find(([key, value]) => key === selectedAnswer);
            const selectedLetter = selectedOption ? selectedOption[0] : null;

            console.log("Selected letter:", selectedLetter);

            // Check if the selected answer matches the correct answer (case-insensitive comparison)
            const isCorrect = selectedLetter && selectedLetter.toLowerCase() === correctAnswer.toLowerCase();

            // Send the assessment result to the backend
            const userEmail = sessionStorage.getItem('user');
            const selectedJobTitle = sessionStorage.getItem('selectedJobTitle');
            const response = await fetch(`https://ccmps-server-node.vercel.app/api/auth/store-answer?email=${userEmail}&job=${encodeURIComponent(selectedJobTitle)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail,
                    position: selectedJobTitle,
                    question: currentQuestion.question_number,
                    answer: selectedLetter,
                    result: isCorrect ? 'correct' : 'incorrect',
                }),
            });

            if (response.ok) {
                console.log("Answer stored successfully");

                // Proceed to the next question
                handleNextQuestion();

                // Check if this is the last question
                if (currentQuestionIndex === questions.length - 1) {
                    // Show SweetAlert message
                    Swal.fire({
                        title: "You have completed the assessment",
                        text: "Click the button below to view your score",
                        icon: "success",
                        showCancelButton: false,
                        confirmButtonText: "View Results",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate('/Roadmap/Assessment/Result');
                        }
                    });
                }

            } else {
                console.error("Failed to store answer:", response.statusText);
            }
        } catch (error) {
            console.error("Error storing answer:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="assessmentWrapper">
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
                <div className="assessmentContainer">
                    <div className="assessmentContainerInner">
                        <h1>{sessionStorage.getItem('selectedJobTitle')} Assessment</h1>
                        <div className="assessmentInnerQuestions">
                            <div className="timer">
                                Time Remaining: {formatTime(remainingTime)}
                            </div>
                            <div className="assessmentQuestionsList">
                                {questions.length > 0 && (
                                    <div className="assessmentQuestion" key={currentQuestionIndex}>
                                        <p>{questions[currentQuestionIndex].question_number}</p>
                                        <div className="assessmentChoices">
                                            {Object.entries(questions[currentQuestionIndex].options).map(([key, value]) => (
                                                <label key={key}>
                                                    <input
                                                        type="radio"
                                                        name={`question_${currentQuestionIndex}`}
                                                        value={key}
                                                        onChange={handleOptionChange} // Use the handleOptionChange function
                                                    />
                                                    {value}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="assessmentSubmitButton">
                                <button onClick={() => checkAnswer(selectedAnswer)} disabled={isSubmitting}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {showDropdown && <DropdownModal logoutHandler={handleLogout} />}
            </div>
        </>
    );
}

export default Assessment;