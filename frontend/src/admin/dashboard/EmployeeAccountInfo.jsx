import React, { useState, useEffect } from 'react'
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

import Edit from './employeeaccountinfo_crud/edit';

function EmployeeAccountInfo() {
  const [employees, setEmployees] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleDelete = async (employeeId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this employee data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.post('http://localhost:8800/api/auth/delete-accountinfo', { employeeId });
          fetchEmployees();
          toast.success('Successfully Deleted');
        } catch (error) {
          console.error('Error deleting employee:', error);
        }
      }
    });
  };

  const handleSearch = () => {
    const filtered = employees.filter(employee =>
      `${employee.firstname} ${employee.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  return (
    <>
      <ToastContainer />
      <div className='employee-dashboard-main-frame'>
        <div className='employee-table'>
          <div className='header-box'>
            <h1>Employee Account Information</h1>
          </div>
          <div className="header-box-functions">
            <div className="search-bar">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name..."
              />
              <button onClick={handleSearch}><FontAwesomeIcon icon={faSearch} /></button>
            </div>
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
                {(searchQuery.length > 0 ? filteredEmployees : employees).map(employee => (
                  <tr key={employee.employee_id}>
                    <td>{employee.role}</td>
                    <td>{employee.employee_id}</td>
                    <td>{`${employee.firstname} ${employee.lastname}`}</td>
                    <td>{employee.account_email}</td>
                    <td><input type="password" name="password" value={employee.account_password_plain} /></td>
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
      {isEditModalOpen && <Edit onClose={() => setIsEditModalOpen(false)} />}
    </>
  )
}

export default EmployeeAccountInfo