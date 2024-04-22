import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Assets
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import Add from './employee_crud/add';
import Edit from './employee_crud/edit';

function EmployeeDashboard() {
  const [employees, setEmployees] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const storedEmployees = sessionStorage.getItem('employees');
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
      const response = await axios.get('https://ccmps-server-node.vercel.app/api/auth/read-employee');
      const fetchedEmployees = response.data;
      // Store fetched employees in session storage
      sessionStorage.setItem('employees', JSON.stringify(fetchedEmployees));
      setEmployees(fetchedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const toggleAddModal = () => {
    setIsAddModalOpen(!isAddModalOpen);
  };

  const toggleEditModal = (employeeId) => {
    sessionStorage.setItem('editEmployeeId', employeeId);
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleDelete = async (employeeId) => {
    const confirmed = window.confirm('Are you sure you want to delete this employee?');
    if (confirmed) {
      try {
        await axios.post('https://ccmps-server-node.vercel.app/api/auth/delete-employee', { employeeId }); // Send employee ID in the request body
        // Refresh the employee list after deletion
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  return (
    <>
      <div className='employee-dashboard-main-frame'>
        <div className='employee-table'>
          <div className='header-box'>
            <h1>List of Employees</h1>
            <button className='employee-table-add-button' onClick={toggleAddModal} > <FontAwesomeIcon icon={faPlusCircle} /> Add </button>
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
                        <button className='employee-table-edit-button' onClick={() => toggleEditModal(employee.employee_id)}> <FontAwesomeIcon icon={faEdit} /> </button>
                        <button className='employee-table-delete-button' onClick={() => handleDelete(employee.employee_id)}> <FontAwesomeIcon icon={faTrash} /> </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isAddModalOpen && <Add onClose={() => setIsAddModalOpen(false)} />}
      {isEditModalOpen && <Edit onClose={() => setIsEditModalOpen(false)} />}
    </>
  );
}

export default EmployeeDashboard;