import React, { useState, useEffect } from 'react'
import axios from 'axios'

import "../styles/EmployeeCrud.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function edit({ onClose }) {
    const [formData, setFormData] = useState({
        company: '',
        jobTitle: '',
        companyAddress: '',
        startDate: '',
        endDate: '',
        skills: '',
    });

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const fetchEmployeeData = async () => {
        try {
            const employeeId = sessionStorage.getItem('editEmployeeId');
            const response = await axios.get(`https://ccmps-server-node.vercel.app/api/auth/get-jobhistory/${employeeId}`);
            const employeeData = response.data;

            setFormData({
                company: employeeData.company,
                jobTitle: employeeData.job_title,
                skills: employeeData.skills,
                companyAddress: employeeData.company_address,
                startDate: employeeData.start_date,
                endDate: employeeData.end_date,
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
            await axios.post('https://ccmps-server-node.vercel.app/api/auth/edit-jobhistory', { employee_id: employeeId, ...formData });
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
                        <label htmlFor='company'>Company:</label>
                        <input type='text' id='company' name='company' value={formData.company} onChange={handleChange} />

                        <label htmlFor='jobTitle'>Job Title:</label>
                        <input type='text' id='jobTitle' name='jobTitle' value={formData.jobTitle} onChange={handleChange} />

                        <label htmlFor='skills'>Skills:</label>
                        <textarea id='skills' name='skills' row='5' value={formData.skills} onChange={handleChange} />

                        <label htmlFor='companyAddress'>Company Address:</label>
                        <input type='text' id='companyAddress' name='companyAddress' value={formData.companyAddress} onChange={handleChange} />

                        <label htmlFor='startDate'>Start Date:</label>
                        <input type='date' id='startDate' name='startDate' value={formData.startDate} onChange={handleChange} />

                        <label htmlFor='endDate'>End Date:</label>
                        <input type='date' id='endDate' name='endDate' value={formData.endDate} onChange={handleChange} />

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