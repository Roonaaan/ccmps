import React, { useState } from "react";
import "./styles/Home.css";
import "./styles/Employee.css";
import "./styles/Statistics.css";
import logo from "../assets/homepage/final-topright-logo.png";
import userIcon from "../assets/admin/user.png";
import userStatistic from "../assets/admin/statistics.png";

// Import your other dashboard components here
import EmployeesDashboard from "./dashboard/EmployeeDashboard";
import StatisticsDashboard from "./dashboard/StatisticsDashboard";

const Home = () => {
  const [selectedItem, setSelectedItem] = useState(1); // Set default to 1 for Statistics

  const handleClick = (index) => {
    setSelectedItem(index);
  };

  const renderDashboardComponent = () => {
    switch (selectedItem) {
      case 0:
        return <EmployeesDashboard />;
      case 1:
        return <StatisticsDashboard />;
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
              <img src={logo} alt='career-compass-logo' className='career-compass-image'/>
            </div>

            <ul>
              <li
                className={selectedItem === 0 ? 'clicked' : ''}
                onClick={() => handleClick(0)}
              >
                <span className='icons'><img src={userIcon} alt="user-icon" className='user-icon-image'/></span>Employees
              </li>
              <li
                className={selectedItem === 1 ? 'clicked' : ''}
                onClick={() => handleClick(1)}
              >
                <span className='icons'><img src={userStatistic} alt="user-icon" className='user-icon-image'/></span>Statistics
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
