import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Assets
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

function EmployeeDashboard() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/auth/read-employee');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  return (
    <div className='employee-dashboard-main-frame'>
      <div className='employee-table'>
        <div className='header-box'>
          <h1>List of Employees</h1>
          <button className='employee-table-add-button'> <FontAwesomeIcon icon={faPlusCircle} /> Add </button>
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
              {employees.map(employee => (
                <tr key={employee.employee_id}>
                  <td>{`${employee.firstname} ${employee.lastname}`}</td>
                  <td>{employee.employee_id}</td>
                  <td>{employee.email}</td>
                  <td>{employee.age}</td>
                  <td>{employee.job_position}</td>
                  <td>
                    <div className="employee-table-button">
                      <button className='employee-table-edit-button'> <FontAwesomeIcon icon={faEdit} /> </button>
                      <button className='employee-table-delete-button'> <FontAwesomeIcon icon={faTrash} /> </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;