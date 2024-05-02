import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const HomeDashboard = () => {
  const [userRole, setUserRole] = useState('');
  const lineChartRef = useRef(null);
  const columnChartRef = useRef(null);

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
    // Line Chart
    const lineCtx = lineChartRef.current.getContext('2d');
    const lineChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Line Graph',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Column Chart
    const columnCtx = columnChartRef.current.getContext('2d');
    const columnChart = new Chart(columnCtx, {
      type: 'bar',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Column Graph',
          data: [35, 39, 60, 71, 46, 45, 30],
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    return () => {
      lineChart.destroy();
      columnChart.destroy();
    };
  }, []);

  return (
    <div className='home-parent-frame'>
      <div className='home'>
        <div className='home-header'>
          <h1>Welcome {userRole}</h1>
          <p>Dashboard</p>
        </div>

        <div className='stats-parent'>
          <div className='upper-row-stats'>
            <div className='row-box'>1</div>
            <div className='row-box'>2</div>
            <div className='row-box'>3</div>
            <div className='row-box'>4</div>
          </div>

          <div className='middle-row-graphs'>
            <div className='graph-box'>
              <canvas ref={lineChartRef}></canvas> {/* Line graph */}
            </div>
            <div className='graph-box'>
              <canvas ref={columnChartRef}></canvas> {/* Column graph */}
            </div>
          </div>

          <div className='lower-row-stats'>
            <div className='low-row-box'>1</div>
            <div className='low-row-box'>2</div>
            <div className='low-row-box'>3</div>
            <div className='low-row-box'>4</div>
          </div>

          <div className='statistic-group'>
            <div className='statistic-chuchu'>1</div>
            <div className='statistic-chuchu'>2</div>
            <div className='statistic-chuchu'>3</div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;