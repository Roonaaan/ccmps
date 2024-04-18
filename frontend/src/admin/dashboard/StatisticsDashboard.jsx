import React, { useState, useEffect } from 'react';

function StatisticsDashboard() {
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    // Fetch user information after component mounts
    const fetchUserData = async () => {
      try {
        // Retrieve the email address from session storage
        const email = sessionStorage.getItem('email');

        // Ensure email address is available
        if (!email) {
          console.error('Email address not found in session storage');
          return;
        }

        const response = await fetch('http://localhost:8800/api/auth/user-info', {
          method: 'POST', // Assuming you're sending the email address via POST method
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
          const userData = await response.json();
          // Assuming the backend sends the user's first name as 'firstName'
          setFirstName(userData.firstName);
        } else {
          // Handle error response
          console.error('Failed to fetch user information');
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      }
    };

    fetchUserData(); // Call the function to fetch user information
  }, []); // Empty dependency array ensures this effect runs only once after component mounts

  return (
    <div className='statistic-parent-frame'>
      <div className='stats'>
        <div className='stat-header'>
          <h1>Welcome Back {firstName}</h1>
        </div>
        <div className='stat-table'>
          <div className='stat-type'>
            <p>Number of Employee</p>
          </div>
          <div className='stat-type'>
            <p>Roadmap Created</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsDashboard;
