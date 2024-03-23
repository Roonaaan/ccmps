import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import "./styles/Profile.css"

// Images
import logo from "../assets/homepage/final-topright-logo.png";
import defaultImg from "../assets/signed-in/defaultImg.jpg"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons'

const Profile = () => {

  const [userName, setUserName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // User Profile
  const [userImage, setUserImage] = useState('');
  const [userFullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [empNumber, setEmpNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [civilStatus, setCivilStatus] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [school, setSchool] = useState('');
  const [year, setYear] = useState('');
  const [employmentHistory, setEmploymentHistory] = useState([]);
  const [educationalBackground, setEducationalBackground] = useState([]);


  // React to PHP Connection (Profile)
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userEmail = sessionStorage.getItem('user');
        if (userEmail) {
          const response = await fetch(`http://localhost/CareerCompass/backend/signed-in/profile.php?email=${userEmail}`);
          const data = await response.json();

          if (data.success) {
            const { userFullName, jobTitle, empNumber, email, phone,
              age, birthday, gender, nationality, civilStatus,
              homeAddress, district, city, province, postalCode,
              company, title, companyAddress, startDate, endDate,
              gradeLevel, school, year, employmentHistory, educationalBackground } = data.profile;
            setUserImage(`data:image/jpeg;base64,${data.userImage}`);
            setFullName(userFullName);
            setJobTitle(jobTitle);
            setEmpNumber(empNumber);
            setEmail(email);
            setPhone(phone);
            setAge(age);
            setBirthday(birthday);
            setGender(gender);
            setNationality(nationality);
            setHomeAddress(homeAddress);
            setDistrict(district);
            setCity(city);
            setProvince(province);
            setPostalCode(postalCode);
            setCompany(company);
            setTitle(title);
            setCompanyAddress(companyAddress);
            setStartDate(startDate);
            setEndDate(endDate);
            setGradeLevel(gradeLevel);
            setSchool(school);
            setYear(year);
            setEmploymentHistory(employmentHistory);
            setEducationalBackground(educationalBackground);
          } else {
            console.log('Failed to fetch user profile:', data.message);
          }
        }
      } catch (error) {
        console.error('An error occured', error);
      }
    }

    fetchUserProfile();
  }, []);



  // React to PHP Connection
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userEmail = sessionStorage.getItem('user'); // Retrieve user email from sessionStorage
        if (userEmail) {
          const response = await fetch(`http://localhost/CareerCompass/backend/signed-in/home.php?email=${userEmail}`);
          const data = await response.json();

          if (data.success) {
            setUserName(data.userName);
            setUserImage(data.userImage);

            if (data.userImage) {
              setUserImage(`data:image/jpeg;base64,${data.userImage}`); // Assuming JPEG format, adjust content type if needed
            } else {
              setUserImage(defaultImg);
            }
          } else {
            console.log('Failed to fetch user name');
          }
        }
      } catch (error) {
        console.error('An error occurred', error);
      }
    };

    fetchUserName();
  }, []);

  const handleProfileClick = () => {
    navigate('/My-Profile');
  }

  // Logout User
  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/');
  }

  // Return to Home Page
  const handleHomeClick = () => {
    navigate('/Welcome')
  }

  const DropdownModal = ({ logoutHandler }) => {
    return (
      <div className="dropdown-modal">
        <div className="profile-info">
          <img
            src={userImage || defaultImg}
            alt='profile'
            className='profileImg'
          />
          <p className='username'>{userName}</p>
        </div>
        <ul>
          <li><button onClick={handleProfileClick}> My Profile </button></li>
          <li><button onClick={logoutHandler}> Log Out </button></li>
        </ul>
      </div>
    );
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  }

  return (
    <>
      <div className="profileContainer">
        <header className="navBar">
          <div className="navBarInner">
            <div className="navLogoContainer">
              <img src={logo} alt="logo" className="navLogo" onClick={handleHomeClick}/>
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

        <div className="profileInner">
          {/* Employee Profile */}
          <div className="profileEmpContainer">
            <div className="profileEmpImage">
              <img src={userImage || defaultImg} alt='profile' /> {/* IMAGE */}
            </div>
            <div className="profileEmpNameContainer">
              <div className="profileEmpNameDetails">
                <h1> {userFullName} </h1> {/* FIRST AND LAST NAME */}
              </div>
              <div className="profileEmpNameDetails">
                <p> {jobTitle} </p> {/* JOB_POSITIN */}
              </div>
              <div className="profileEmpNameDetails">
                <p1> {empNumber}  </p1> {/* EMP_ID */}
              </div>
            </div>
            <div className="underline" />
            <div className="profileEmpDetailContainer">
              <div className="profileEmpDetail">
                <p><FontAwesomeIcon icon={faEnvelope} /> {email} </p> {/* EMAIL */}
              </div>
              <div className="profileEmpDetail">
                <p><FontAwesomeIcon icon={faPhone} /> {phone} </p> {/* PHONE_NUMBER */}
              </div>
            </div>
          </div>
          {/* Employee Background */}
          <div className="profileEmpBackgroundContainer">
            <div className="profileEmpBackgroundPersonalInfoContainer">
              <label htmlFor="personalInfo"> Personal Information </label>
              <div className="profileEmpBackgroundPersonalInfo">
                <div className="profileEmpPersonalInfo">
                  <p> Age: </p> {/* AGE */}
                  <p1> {age} </p1>
                </div>
                <div className="profileEmpPersonalInfo">
                  <p> Birthday: </p> {/* BIRTHDAY */}
                  <p1> {birthday} </p1>
                </div>
                <div className="profileEmpPersonalInfo">
                  <p> Gender: </p> {/* GENDER */}
                  <p1> {gender} </p1>
                </div>
                <div className="profileEmpPersonalInfo">
                  <p> Nationality: </p> {/* NATIONALITY */}
                  <p1> {nationality} </p1>
                </div>
                <div className="profileEmpPersonalInfo">
                  <p> Civil Status: </p> {/* CIVIL_STATUS */}
                  <p1> {civilStatus} </p1>
                </div>
              </div>
            </div>
            {/* Employee Address */}
            <div className="profileEmpBackgroundAddressContainer">
              <label htmlFor="Address"> Address </label>
              <div className="profileEmpBackgroundAddress">
                <div className="profileEmpAddress">
                  <p> Home Address: </p> {/* HOME_ADDRESS */}
                  <p1> {homeAddress} </p1>
                </div>
                <div className="profileEmpAddress">
                  <p> District: </p> {/* DISTRICT */}
                  <p1> {district} </p1>
                </div>
                <div className="profileEmpAddress">
                  <p> City: </p> {/* CITY */}
                  <p1> {city} </p1>
                </div>
                <div className="profileEmpAddress">
                  <p> Province: </p> {/* PROVINCE */}
                  <p1> {province} </p1>
                </div>
                <div className="profileEmpAddress">
                  <p> Postal Code: </p> {/* POSTAL_CODE */}
                  <p1> {postalCode} </p1>
                </div>
              </div>
            </div>
            {/* Employment History */}
            <div className="profileEmpBackgroundEmploymentHistoryContainer">
              <label htmlFor="empHistory"> Employment History </label>
              <div className="profileEmpBackgroundEmploymentHistory">
                <div className="profileEmpHistory">
                  <p> Company: </p> {/* COMPANY */}
                  <p1> {company} </p1>
                </div>
                <div className="profileEmpHistory">
                  <p> Job Title: </p> {/* JOB_TITLE */}
                  <p1> {title} </p1>
                </div>
                <div className="profileEmpHistory">
                  <p> Address: </p> {/* COMPANY_ADDRESS */}
                  <p1> {companyAddress} </p1>
                </div>
                <div className="profileEmpHistory">
                  <p> Start Date: </p> {/* START_DATE */}
                  <p1> {startDate} </p1>
                </div>
                <div className="profileEmpHistory">
                  <p> End Date: </p> {/* END_DATE */}
                  <p1> {endDate} </p1>
                </div>
              </div>
            </div>
            {/* Educational Background y */}
            <div className="profileEmpBackgroundEmploymentHistoryContainer">
              <label htmlFor="empHistory"> Educational Background </label>
              <div className="profileEmpBackgroundEmploymentHistory">
                <div className="profileEmpHistory">
                  <p> Grade/Level </p> {/* GRADE_LEVEL */}
                  <p1> {gradeLevel} </p1>
                </div>
                <div className="profileEmpHistory">
                  <p> School: </p> {/* SCHOOL */}
                  <p1> {school} </p1>
                </div>
                <div className="profileEmpHistory">
                  <p> Year Graduated: </p> {/* YEAR_GRADUATE */}
                  <p1> {year} </p1>
                </div>
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