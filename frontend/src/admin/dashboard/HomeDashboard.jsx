import React, { useState, useEffect } from 'react';

// Assets
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBuilding, faBriefcase, faRoad } from '@fortawesome/free-solid-svg-icons';

const HomeDashboard = () => {
  const [userRole, setUserRole] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalRoadmaps, setTotalRoadmaps] = useState(0);

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    setUserRole(role);

    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const userEmail = sessionStorage.getItem('email');
        const response = await fetch(`https://ccmps-server-node.vercel.app/api/auth/admin-profile?email=${userEmail}`);
        const data = await response.json();
        if (data.success) {
          setUserRole(data.userData.role)
        } else {
          console.error('Failed to fetch user profile:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    // Fetch total numbers from the backend
    const fetchTotalNumbers = async () => {
      try {
        const response = await fetch('https://ccmps-server-node.vercel.app/api/auth/total-number');
        const data = await response.json();
        if (data) {
          setTotalUsers(data.totalUsers);
          setTotalDepartments(data.totalDepartments);
          setTotalJobs(data.totalJobs);
          setTotalRoadmaps(data.totalRoadmaps);
        }
      } catch (error) {
        console.error('Error fetching total numbers:', error);
      }
    };

    fetchTotalNumbers();
  }, []);

  return (
    <>
      <div className='home-parent-frame'>
        <div className='home'>
          <div className='home-header'>
            <h1>Welcome {userRole}</h1>
            <p>Dashboard</p>
          </div>
          <div className="home-row">
            <div className="home-row-card">
              <div className="home-row-card-banner">
                <div className="row-card-banner-contents">
                  <span className='row-icon'><FontAwesomeIcon icon={faUsers} /></span>
                  <div className="row-card-banner-data">
                    <h1>{totalUsers}</h1>
                    <span>Users</span>
                  </div>
                </div>
                <div className="row-card-banner-contents">
                  <span className='row-icon'><FontAwesomeIcon icon={faBuilding} /></span>
                  <div className="row-card-banner-data">
                    <h1>{totalDepartments}</h1>
                    <span>Departments</span>
                  </div>
                </div>
                <div className="row-card-banner-contents">
                  <span className='row-icon'><FontAwesomeIcon icon={faBriefcase} /></span>
                  <div className="row-card-banner-data">
                    <h1>{totalJobs}</h1>
                    <span>Jobs</span>
                  </div>
                </div>
                <div className="row-card-banner-contents">
                  <span className='row-icon'><FontAwesomeIcon icon={faRoad} /></span>
                  <div className="row-card-banner-data">
                    <h1>{totalRoadmaps}</h1>
                    <span>Roadmaps</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="home-row-chart">
            <div className="home-row-chart-card">
              <div className="row-chart-contents">

              </div>
              <div className="row-chart-contents">

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeDashboard;