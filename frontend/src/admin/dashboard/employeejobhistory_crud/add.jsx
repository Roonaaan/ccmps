import React, { useState, useEffect } from 'react';

import "../styles/EmployeeCrud.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Add({ onClose }) {
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        jobTitle: '',
        company: '',
        companyAddress: '',
        skills: '',
        startDate: '',
        endDate: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8800/api/auth/add-jobhistory', {
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
                    <h2>Add Employee Job History</h2>
                    <span className='close' onClick={onClose} >&times;</span>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <label htmlFor='employeeId'>Employee ID:</label>
                            <input type='number' id='employeeId' name='employeeId' onChange={handleChange} value={formData.employeeId} />

                            <label htmlFor='jobTitle'>Job Title:</label>
                            <input type='text' id='jobTitle' name='jobTitle' value={formData.jobTitle} onChange={handleChange} />

                            <label htmlFor='company'>Company Name:</label>
                            <input type='text' id='company' name='company' value={formData.company} onChange={handleChange} />

                            <label htmlFor='companyAddress'>Company Address:</label>
                            <input type='text' id='companyAddress' name='companyAddress' value={formData.companyAddress} onChange={handleChange} />

                            <label htmlFor='skills'>Skills:</label>
                            <textarea id='skills' name='skills' row='5' value={formData.skills} onChange={handleChange} />

                            <label htmlFor='startDate'>Start date:</label>
                            <input type='date' id='startDate' name='startDate' value={formData.startDate} onChange={handleChange} />

                            <label htmlFor='endDate'>End date:</label>
                            <input type='date' id='endDate' name='endDate' value={formData.endDate} onChange={handleChange} />

                            <div className='savingbutton'>
                                <button className='save' type="submit">Save</button>
                                <button className='cancel' onClick={onClose}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    )
}

export default Add
