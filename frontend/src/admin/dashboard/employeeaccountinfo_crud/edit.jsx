import React, { useState, useEffect } from 'react'
import axios from 'axios'

import "../styles/EmployeeCrud.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function edit({ onClose }) {
  const [formData, setFormData] = useState({
    passwordPlain: '',
  });

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const employeeId = sessionStorage.getItem('editEmployeeId');
      const response = await axios.get(`https://ccmps-server-node.vercel.app/api/auth/get-accountinfo/${employeeId}`);
      const employeeData = response.data;

      setFormData({
        passwordPlain: employeeData.account_password_plain,
      });
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const employeeId = sessionStorage.getItem('editEmployeeId');
      await axios.post('https://ccmps-server-node.vercel.app/api/auth/edit-accountinfo', { employee_id: employeeId, ...formData });
      onClose(); // Close the modal after successful submission
      toast.success('Successfully Changed');
    } catch (error) {
      console.error('Error editing employee information:', error);
      // Handle error
    }
  };

  return (
    <>
      <div className="employee-modal-overlay">
        <div className="employee-modal">
          <h2>Edit Employee</h2>
          <span className='close' onClick={onClose} >&times;</span>
          <form onSubmit={handleSubmit}>
            <label htmlFor='password'>New Password:</label>
            <input type='text' id='passwordPlain' name='passwordPlain' value={formData.passwordPlain} onChange={handleChange} />
            <div className='savingbutton'>
              <button className='save'>Save</button>
              <button className='cancel' onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default edit;