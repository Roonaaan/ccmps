import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Assets
import "./styles/style.css";
import logo from "../../assets/homepage/final-topright-logo-light.png";
import defaultImg from "../../assets/signed-in/defaultImg.jpg";
import Swal from "sweetalert2";
import { Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';

export const Result = () => {
  const [userImage, setUserImage] = useState("");
  const [userName, setUserName] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalCorrectPercentage, setTotalCorrectPercentage] = useState(0);
  const [totalIncorrectPercentage, setTotalIncorrectPercentage] = useState(0);
  const [result, setResult] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

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

  // Fetch Score Percentage
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const userEmail = sessionStorage.getItem('user');
        const selectedJobTitle = sessionStorage.getItem('selectedJobTitle');
        const response = await fetch(`http://localhost:8800/api/auth/results?email=${userEmail}&job=${encodeURIComponent(selectedJobTitle)}`);
        const data = await response.json();
        if (data.success) {
          setPercentage(data.percentage);
          setTotalQuestions(data.totalQuestions);
          setTotalCorrectPercentage(data.totalCorrectPercentage);
          setTotalIncorrectPercentage(data.totalIncorrectPercentage);
          setResult(data.result);
        } else {
          console.error('Failed to fetch assessment result');
        }
      } catch (error) {
        console.error('An error occurred while fetching assessment result:', error);
      }
    };

    fetchResult();
  }, []);

  const data = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [totalCorrectPercentage, totalIncorrectPercentage],
        backgroundColor: [
          '#33658A',
          '#27374D'
        ],
        hoverBackgroundColor: [
          '#33658A',
          '#27374D'
        ]
      }
    ]
  };
  

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

  return (
    <>
      <div className="resultWrapper">
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

        <div className="resultContainer">
          <div className="resultContainerInner">
            <h1>{sessionStorage.getItem('selectedJobTitle')} Assessment Result </h1>
            <div className="resultInnerContainer">
              <div className="resultInnerGraph">
                <Doughnut data={data} />
              </div>
              <div className="resultInnerDetails">
                <p> Result Summary </p>
                <div className="resultDetails">
                  <ul className="resultBreakdown">
                    <li>
                      <div className="resultTitle">Total Questions Answered</div>
                      :
                      <div className="resultText">{totalQuestions}</div>
                    </li>
                    <li>
                      <div className="resultTitle">Total Correct Answers %</div>
                      :
                      <div className="resultText">{totalCorrectPercentage}%</div>
                    </li>
                    <li>
                      <div className="resultTitle">Total Incorrect Answers %</div>
                      :
                      <div className="resultText">{totalIncorrectPercentage}%</div>
                    </li>
                    <li>
                      <div className="resultTitle">Result</div>
                      :
                      <div className="resultText"><span style={{ color: result === "Passed" ? "green" : "red" }}>{result}</span></div>
                    </li>
                  </ul>
                </div>
                <div className="resultButtons">
                  <button> Try Again </button>
                  <button disabled={result === "Failed"} style={{ opacity: result === "Failed" ? 0.5 : 1 }}> Proceed</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showDropdown && <DropdownModal logoutHandler={handleLogout} />}
    </>
  )
}

export default Result
