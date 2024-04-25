import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Assets
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import Add from './employeebasicinfo_crud/add';
import Edit from './employeebasicinfo_crud/edit';

function EmployeeBasicInfoDashboard() {
  const [employees, setEmployees] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const storedEmployees = sessionStorage.getItem('basicinfo');
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
      const response = await axios.get('http://localhost:8800/api/auth/read-basicinfo');
      const fetchedEmployees = response.data.map(employee => ({
        ...employee,
        // Convert Buffer image data to base64 string for image display
        image: `data:image/jpeg;base64,${arrayBufferToBase64(employee.image.data)}`
      }));
      // Store fetched employees in session storage
      sessionStorage.setItem('basicinfo', JSON.stringify(fetchedEmployees));
      setEmployees(fetchedEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };
  
  // Function to convert ArrayBuffer to base64
  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

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
        await axios.post('http://localhost:8800/api/auth/delete-basicinfo', { employeeId }); // Send employee ID in the request body
        // Refresh the employee list after deletion
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if employees are empty and fetch them if so
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
            <h1>Employee Basic Information</h1>
            <button className='employee-table-add-button' onClick={toggleAddModal}> <FontAwesomeIcon icon={faPlusCircle} /> Add </button>
          </div>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Image</th>
                  <th>Full Name</th>
                  <th>Age</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Address</th>
                  <th>Gender</th>
                  <th>Birthday</th>
                  <th>Nationality</th>
                  <th>Civil Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => (
                  <tr key={employee.employee_id}>
                    <td>{employee.employee_id}</td>
                    <td><img src={employee.image} alt="Employee" style={{ width: '50px', height: '50px' }} /></td>
                    <td>{`${employee.firstname} ${employee.lastname}`}</td>
                    <td>{employee.age}</td>
                    <td>{employee.email}</td>
                    <td>{employee.phone_number}</td>
                    <td>{`${employee.home_address}, ${employee.city}, District ${employee.district}, ${employee.postal_code}, ${employee.province}`}</td>
                    <td>{employee.gender}</td>
                    <td>{employee.birthday ? formatDate(employee.birthday) : ''}</td>
                    <td>{employee.nationality}</td>
                    <td>{employee.civil_status}</td>
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

export default EmployeeBasicInfoDashboard;