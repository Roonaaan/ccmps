import React, { useState, useEffect } from 'react';

// Assets
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBuilding, faBriefcase, faRoad } from '@fortawesome/free-solid-svg-icons';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend);

const HomeDashboard = () => {
  const [userRole, setUserRole] = useState('');
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalRoadmaps, setTotalRoadmaps] = useState(0);
  const [jobsPerDepartment, setJobsPerDepartment] = useState([]);
  const [employeesVsAdmins, setEmployeesVsAdmins] = useState([]);

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    setUserRole(role);

    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const userEmail = sessionStorage.getItem('email');
        const response = await fetch(`http://localhost:8800/api/auth/admin-profile?email=${userEmail}`);
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
        const response = await fetch('http://localhost:8800/api/auth/total-number');
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

  useEffect(() => {
    // Fetch chart data from the backend
    const fetchChartData = async () => {
      try {
        const response = await fetch('http://localhost:8800/api/auth/chart-dashboard');
        const data = await response.json();
        if (data) {
          console.log('Chart Data:', data);
          setJobsPerDepartment(data.jobsPerDepartment);
          setEmployeesVsAdmins(data.employeesVsAdmins);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, []);

  const jobsPerDepartmentData = {
    labels: jobsPerDepartment.map(dept => dept.department),
    datasets: [{
      data: jobsPerDepartment.map(dept => dept.total_jobs),
      backgroundColor: ['#003366', '#FFA500', '#000080', '#CCCCCC', '#008000', '#008080'],
      hoverOffset: 8
    }]
  };

  const employeesVsAdminsData = {
    labels: employeesVsAdmins.map(role => role.role_type),
    datasets: [{
      data: employeesVsAdmins.map(role => role.total_count),
      backgroundColor: ['#33658A', '#27374D'],
      hoverBackgroundColor: ['#33658A', '#27374D']
    }]
  };

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
              <div className="home-row-chart-card-frame">
                <div className="row-chart-contents">
                  <h2>Jobs Per Department</h2>
                  <Doughnut data={jobsPerDepartmentData} />
                </div>
              </div>
              <div className="home-row-chart-card-frame">
                <div className="row-chart-contents">
                  <h2>Employees vs Admins</h2>
                  <Doughnut data={employeesVsAdminsData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeDashboard;
