import React, { useState } from "react";

// CSS and Assets
import "./styles/Home.css";
import "./dashboard/styles/Employee.css";
import "./dashboard/styles/Home.css";
import logo from "../assets/homepage/final-topright-logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faChartLine,
  faChartBar,
  faUserTie,
  faAddressBook,
  faGraduationCap,
  faBriefcase
} from "@fortawesome/free-solid-svg-icons";

// Import your other dashboard components here
import HomeDashboard from "./dashboard/HomeDashboard";
import PromotionDashboard from "./dashboard/EmployeePromotionDashboard";
import BasicInfoDashboard from "./dashboard/EmployeeBasicInfoDashboard";
import JobInfoDashboard from "./dashboard/EmployeeJobInfoDashboard";
import AccountInfoDashboard from "./dashboard/EmployeeAccountInfo";
import EduchistoryInfoDashboard from "./dashboard/EmployeeEducationHistory";
import JobhistoryInfoDashboard from "./dashboard/EmployeeJobHistory";

const Home = () => {
  const [selectedItem, setSelectedItem] = useState(1); // Set default to 1 for Statistics

  const handleClick = (index) => {
    setSelectedItem(index);
  };

  const renderDashboardComponent = () => {
    switch (selectedItem) {
      case 0:
        return <PromotionDashboard />
      case 1:
        return <HomeDashboard />;
      case 2:
        return <BasicInfoDashboard />;
      case 3:
        return <JobInfoDashboard />
      case 4:
        return <AccountInfoDashboard />
      case 5: 
        return <EduchistoryInfoDashboard />
      case 6:
        return <JobhistoryInfoDashboard />
      default:
        return null;
    }
  };

  return (
    <>
      <div className='parent-main-frame'>
        <section className='dashboard'>
          <div className='dashboard-content'>
            <div className='career-compass-logo'>
              <img src={logo} alt='career-compass-logo' className='career-compass-image' />
            </div>
            <ul>
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
                  <FontAwesomeIcon icon={faChartLine} className="fa-icon" />
                </span>
                Promotion
              </li>
              <li
                className={selectedItem === 2 ? "clicked" : ""}
                onClick={() => handleClick(2)}
              >
                <span className="icons">
                  <FontAwesomeIcon icon={faUser} className="fa-icon" />
                </span>
                Employees
              </li>
              <li
                className={selectedItem === 5 ? "clicked" : ""}
                onClick={() => handleClick(5)}
              >
                <span className="icons">
                  <FontAwesomeIcon
                    icon={faGraduationCap}
                    className="fa-icon"
                  />
                </span>
                Employee Edu History
              </li>
              <li
                className={selectedItem === 6 ? "clicked" : ""}
                onClick={() => handleClick(6)}
              >
                <span className="icons">
                  <FontAwesomeIcon
                    icon={faBriefcase}
                    className="fa-icon"
                  />
                </span>
                Employee Job History
              </li>
              <li
                className={selectedItem === 3 ? "clicked" : ""}
                onClick={() => handleClick(3)}
              >
                <span className="icons">
                  <FontAwesomeIcon
                    icon={faUserTie}
                    className="fa-icon"
                  />
                </span>
                Employee Job Info
              </li>
              <li
                className={selectedItem === 4 ? "clicked" : ""}
                onClick={() => handleClick(4)}
              >
                <span className="icons">
                  <FontAwesomeIcon
                    icon={faAddressBook}
                    className="fa-icon"
                  />
                </span>
                Employee Account Info
              </li>
            </ul>
          </div>
        </section>
        <section className='selected-content'>
          {/* Render the selected dashboard component */}
          {renderDashboardComponent()}
        </section>
      </div>
    </>
  );
};

export default Home;
