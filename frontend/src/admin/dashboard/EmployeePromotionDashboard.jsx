import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PromotionReview from './employeepromotion_review/promotionreview';

function EmployeePromotionDashboard() {
  const [employees, setEmployees] = useState([]);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);

  useEffect(() => {
    const storedEmployees = sessionStorage.getItem('promotioninfo');
    if (storedEmployees) {
      // If employees exist in session storage, use them directly
      setEmployees(JSON.parse(storedEmployees));
    } else {
      // Fetch employees from the backend if not available in session storage
      fetchEmployees();
    }
  }, []);

  const togglePromotionModal = (employeeId) => {
    sessionStorage.setItem('editEmployeeId', employeeId);
    setIsPromotionModalOpen(!isPromotionModalOpen);
};

  const fetchEmployees = async () => {
    try {
        const response = await axios.get('http://localhost:8800/api/auth/read-promotioninfo');
        const fetchedEmployees = response.data.map(employee => ({
            ...employee,
        }));
        // Store fetched employees in session storage
        sessionStorage.setItem('promotioninfo', JSON.stringify(fetchedEmployees));
        setEmployees(fetchedEmployees);
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
};

  useEffect(() => {
    if (employees.length === 0) {
      fetchEmployees();
    }
  }, [employees]);

  return (
    <>
    <ToastContainer />
    <div className='employee-dashboard-main-frame'>
        <div className='employee-table'>
          <div className='header-box'>
            <h1>Employee Basic Information</h1>
          </div>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Job Selected</th>
                  <th>Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => (
                  <tr key={employee.employee_id}>
                    <td>{employee.employee_id}</td>
                    <td>{`${employee.firstname} ${employee.lastname}`}</td>
                    <td>{employee.email}</td>
                    <td>{employee.position}</td>
                    <td>{`${employee.score} / ${employee.total_questions}`}</td>
                    <td>
                      <div className="employee-table-button">
                        <button className='employee-table-edit-button' onClick={() => togglePromotionModal(employee.employee_id)}> <FontAwesomeIcon icon={faMagnifyingGlass} /> </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {isPromotionModalOpen && <PromotionReview onClose={() => setIsPromotionModalOpen(false)} />}
    </>
  )
}

export default EmployeePromotionDashboard
