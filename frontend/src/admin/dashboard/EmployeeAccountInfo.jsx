import React, { useState, useEffect } from 'react'
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import Edit from './employeejobinfo_crud/edit';

function EmployeeAccountInfo() {
  const [employees, setEmployees] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const storedEmployees = sessionStorage.getItem('accountinfo');
    if (storedEmployees) {
      // If employees exist in session storage, use them directly
      setEmployees(JSON.parse(storedEmployees));
    } else {
      // Fetch employees from the backend if not available in session storage
      fetchEmployees();
    }
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/auth/read-accountinfo');
      const fetchedEmployees = response.data.map(employee => ({
        ...employee,
      }));
      // Store fetched employees in session storage
      sessionStorage.setItem('accountinfo', JSON.stringify(fetchedEmployees));
      setEmployees(fetchedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const toggleEditModal = (employeeId) => {
    sessionStorage.setItem('editEmployeeId', employeeId);
    setIsEditModalOpen(!isEditModalOpen);
  };

  useEffect(() => {
    if (employees.length === 0) {
      fetchEmployees();
    }
  }, [employees]);

  return (
    <>
      <div className='employee-dashboard-main-frame'>
        <div className='employee-table'>
          <div className='header-box'>
            <h1>Employee Account Information</h1>
          </div>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Employee Id</th>
                  <th>Full Name</th>
                  <th>Account Email</th>
                  <th>Password</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => (
                  <tr key={employee.employee_id}>
                    <td>{employee.role}</td>
                    <td>{employee.employee_id}</td>
                    <td>{`${employee.firstname} ${employee.lastname}`}</td>
                    <td>{employee.account_email}</td>
                    <td>{employee.account_password}</td>
                    <td>
                      <div className="employee-table-button">
                        <button className='employee-table-edit-button' onClick={() => toggleEditModal(employee.employee_id)}> <FontAwesomeIcon icon={faEdit} /> </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isEditModalOpen && <Edit onClose={() => setIsEditModalOpen(false)} />}
    </>
  )
}

export default EmployeeAccountInfo
