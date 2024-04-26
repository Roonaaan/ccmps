import React, { useState } from "react";

// CSS and Assets
import "./styles/Home.css";
import "./dashboard/styles/Employee.css";
import "./dashboard/styles/Home.css";
import logo from "../assets/homepage/final-topright-logo.png";
import defaultImg from "../assets/signed-in/defaultImg.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faChartBar,
  faUserTie,
  faAddressBook
} from "@fortawesome/free-solid-svg-icons";

// Import your other dashboard components here
import HomeDashboard from "./dashboard/HomeDashboard";
import BasicInfoDashboard from "./dashboard/EmployeeBasicInfoDashboard";
import JobInfoDashboard from "./dashboard/EmployeeJobInfoDashboard";
import AccountInfoDashboard from "./dashboard/EmployeeAccountInfo";

const Home = () => {
  const [selectedItem, setSelectedItem] = useState(1); // Set default to 1 for Statistics

  const handleClick = (index) => {
    setSelectedItem(index);
  };

  const renderDashboardComponent = () => {
    switch (selectedItem) {
      case 0:
        return <BasicInfoDashboard />;
      case 1:
        return <HomeDashboard />;
      case 2:
        return <JobInfoDashboard />
      case 3:
        return <AccountInfoDashboard />
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
                  <FontAwesomeIcon icon={faUser} className="fa-icon" />
                </span>
                Employees
              </li>
              <li
                className={selectedItem === 2 ? "clicked" : ""}
                onClick={() => handleClick(2)}
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
                className={selectedItem === 3 ? "clicked" : ""}
                onClick={() => handleClick(3)}
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
