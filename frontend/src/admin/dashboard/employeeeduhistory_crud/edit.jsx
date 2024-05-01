import React, { useState, useEffect } from 'react'
import axios from 'axios'

import "../styles/EmployeeCrud.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function edit({ onClose }) {
    const [formData, setFormData] = useState({
        school: '',
        yearGraduated: '',
        gradeLevel: 'Junior High School',
        degree: '',
    });

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const fetchEmployeeData = async () => {
        try {
          const employeeId = sessionStorage.getItem('editEmployeeId');
          const response = await axios.get(`http://localhost:8800/api/auth/get-educhistory/${employeeId}`);
          const employeeData = response.data;
    
          setFormData({
            school: employeeData.school,
            yearGraduated: employeeData.year_graduated,
            gradeLevel: employeeData.gradeLevel,
            degree: employeeData.degree_course,
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
            await axios.post('http://localhost:8800/api/auth/edit-educhistory', { employee_id: employeeId, ...formData });
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
                        <label htmlFor='school'>School:</label>
                        <input type='text' id='school' name='school' value={formData.school} onChange={handleChange}/>

                        <label htmlFor='yearGraduated'>Year Graduated:</label>
                        <input type='number' id='yearGraduated' name='yearGraduated' value={formData.yearGraduated} onChange={handleChange}/>

                        <label htmlFor='gradeLevel'>Grade Level:</label>
                        <select id='gradeLevel' name='gradeLevel' value={formData.gradeLevel} onChange={handleChange}>
                            <option value='Junior High School'>Junior High School</option>
                            <option value='Senior High School'>Senior High School</option>
                            <option value='College Graduate 2 Year Course'>College Graduate 2 Year Course</option>
                            <option value='College Graduate 4 Year Course'>College Graduate 4 Year Course</option>
                        </select>
                        
                        <label htmlFor='degree'>Degree/Course:</label>
                        <input type='text' id='degree' name='degree' value={formData.degree} onChange={handleChange}/>
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

export default edit
