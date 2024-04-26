import React, { useState, useEffect } from 'react'
import axios from 'axios'

import "../styles/EmployeeCrud.css";

function edit({ onClose }) {
    const [formData, setFormData] = useState({
        jobPosition: '',
        jobLevel: 'Entry-Level/Junior',
        skills: '',
    });

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const fetchEmployeeData = async () => {
        try {
            const employeeId = sessionStorage.getItem('editEmployeeId');
            const response = await axios.get(`https://ccmps-server-node.vercel.app/api/auth/get-jobinfo/${employeeId}`);
            const employeeData = response.data;

            setFormData({
                jobPosition: employeeData.job_position,
                jobLevel: employeeData.job_level,
                skills: employeeData.skills,
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
            await axios.post('https://ccmps-server-node.vercel.app/api/auth/edit-jobinfo', { employee_id: employeeId, ...formData });
            onClose(); // Close the modal after successful submission
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
                        <label htmlFor='jobPosition'>Job Position:</label>
                        <input type='text' id='jobPosition' name='jobPosition' value={formData.jobPosition} onChange={handleChange} />

                        <label htmlFor='jobLevel'>Job Level:</label>
                        <select id='jobLevel' name='jobLevel' value={formData.jobLevel} onChange={handleChange}>
                            <option value='Entry-Level/Junior'>Entry-Level/Junior</option>
                            <option value='Mid-Level/Intermediate'>Mid-Level/Intermediate</option>
                            <option value='Senior Level'>Senior Level</option>
                            <option value='Executive/Leadership Level'>Executive/Leadership Level</option>
                        </select>
                        <label htmlFor='skills'>Skills:</label>
                        <textarea id='skills' name='skills' row='5' value={formData.skills} onChange={handleChange} />
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