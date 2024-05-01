import React, { useState, useEffect } from 'react';

import "../styles/EmployeeCrud.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Add({ onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    employeeId: '',
    school: '',
    yearGraduated: '',
    gradeLevel: 'Junior High School',
    degree: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8800/api/auth/add-educhistory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        onClose();
        toast.success('Successfully Added');
      } else {
        console.error('Error adding employee:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  return (
    <>
      <div className="employee-modal-overlay">
        <div className="employee-modal">
          <h2>Add Employee Edu History</h2>
          <span className='close' onClick={onClose} >&times;</span>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <label htmlFor='employeeId'>Employee ID:</label>
              <input type='number' id='employeeId' name='employeeId' onChange={handleChange} value={formData.employeeId} />

              <label htmlFor='gradeLevel'>Grade Level:</label>
              <select id='gradeLevel' name='gradeLevel' value={formData.gradeLevel} onChange={handleChange}>
                <option value='Junior High School'>Junior High School</option>
                <option value='Senior High School'>Senior High School</option>
                <option value='College Graduate 2 Year Course'>College Graduate 2 Year Course</option>
                <option value='College Graduate 4 Year Course'>College Graduate 4 Year Course</option>
              </select>

              <label htmlFor='school'>School:</label>
              <input type='text' id='school' name='school' value={formData.school} onChange={handleChange} />

              <label htmlFor='yearGraduated'>Year Graduated:</label>
              <input type='number' id='yearGraduated' name='yearGraduated' value={formData.yearGraduated} onChange={handleChange} />

              <label htmlFor='degree'>Degree:</label>
              <input type='text' id='degree' name='degree' value={formData.degree} onChange={handleChange} />

              <div className='savingbutton'>
                <button className='save' type="submit">Save</button>
                <button className='cancel' onClick={onClose}>Cancel</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default Add;