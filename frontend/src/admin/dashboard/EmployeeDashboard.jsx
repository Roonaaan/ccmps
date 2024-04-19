import React from 'react'

import userEdit from "../dashboard/assets/edit-icon.png";
import userDelete from "../dashboard/assets/delete-icon.png";

function EmployeeDashboard() {
  return (
    <div className='employee-dashboard-main-frame'>
      <div className='employee-table'>
        <div className='header-box'>
          <h1>Employee Table</h1>
          <button className='button'> Create </button>
          
        </div>
        <div>
        <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Employee Number</th>
          <th>Email</th>
          <th>Age</th>
          <th>Job Position</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John Doe</td>
          <td>12345</td>
          <td>john.doe@example.com</td>
          <td>30</td>
          <td>Software Engineer</td>
          <td> 
          <img src={userEdit} alt='edit-icon' className='edit-icon' />
          <img src={userDelete} alt='delete-icon' className='delete-icon' />
          </td>
          
        </tr>
        <tr>
          <td>Jane Smith</td>
          <td>67890</td>
          <td>jane.smith@example.com</td>
          <td>25</td>
          <td>Project Manager</td>
          <td> 
          <img src={userEdit} alt='edit-icon' className='edit-icon' />
          <img src={userDelete} alt='delete-icon' className='delete-icon' />
          </td>
        </tr>
        {/* Add more rows as needed */}
      </tbody>
    </table>
    </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard
