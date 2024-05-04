import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const HomeDashboard = () => {
  const [userRole, setUserRole] = useState ('');
  const lineChartRef = useRef(null);
  const columnChartRef = useRef(null);

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

  return (
    <div className='home-parent-frame'>
      <div className='home'>
        <div className='home-header'>
          <h1>Welcome {userRole}</h1>
          <p>Dashboard</p>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
