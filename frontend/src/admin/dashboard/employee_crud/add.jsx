import React, { useState, useEffect } from 'react'

import "./style.css"

function add({ onClose }) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [employeeId, setEmployeeId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        image: '',
        firstName: '',
        lastName: '',
        age: '',
        email: '',
        phoneNumber: '',
        homeAddress: '',
        district: '',
        city: '',
        province: '',
        postalCode: '',
        gender: 'male', // Default gender to male
        birthday: '',
        nationality: '',
        civilStatus: 'single', // Default civil status to single
        jobPosition: '',
        jobLevel: '',
        skills: ''
    });

    useEffect(() => {
        fetchEmployeeId();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fetchEmployeeId = async () => {
        try {
            const response = await fetch('http://localhost:8800/api/auth/employeeid');
            const data = await response.json();
            setEmployeeId(data.employeeId);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching employee ID:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8800/api/auth/add-employee', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                // Employee added successfully
                onClose();
            } else {
                console.error('Error adding employee:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    };

    return (
        <>
            <div className="add-employee-modal-overlay">
                <div className="add-employee-modal">
                    <h2>Add Employee</h2>
                    <span className='close' onClick={onClose} >&times;</span>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <label htmlFor='employeeId'>Employee ID:</label>
                            <input type='text' id='employeeId' name='employeeId' value={employeeId} readOnly />

                            <label htmlFor='image'>Upload Image:</label>
                            <input type='file' id='image' name='image' accept='image/*' onChange={handleChange} />

                            <label htmlFor='firstName'>First Name:</label>
                            <input type='text' id='firstName' name='firstName' value={formData.firstName} onChange={handleChange} />

                            <label htmlFor='lastName'>Last Name:</label>
                            <input type='text' id='lastName' name='lastName' value={formData.lastName} onChange={handleChange} />

                            <label htmlFor='age'>Age:</label>
                            <input type='number' id='age' name='age' value={formData.age} onChange={handleChange} />

                            <label htmlFor='email'>Email:</label>
                            <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} />

                            <label htmlFor='phoneNumber'>Phone Number:</label>
                            <input type='tel' id='phoneNumber' name='phoneNumber' value={formData.phoneNumber} onChange={handleChange} />

                            <label htmlFor='homeAddress'>Home Address:</label>
                            <input type='text' id='homeAddress' name='homeAddress' value={formData.homeAddress} onChange={handleChange} />

                            <label htmlFor='district'>District:</label>
                            <input type='text' id='district' name='district' value={formData.district} onChange={handleChange} />

                            <label htmlFor='city'>City:</label>
                            <input type='text' id='city' name='city' value={formData.city} onChange={handleChange} />

                            <label htmlFor='province'>Province:</label>
                            <input type='text' id='province' name='province' value={formData.province} onChange={handleChange} />

                            <label htmlFor='postalCode'>Postal Code:</label>
                            <input type='text' id='postalCode' name='postalCode' value={formData.postalCode} onChange={handleChange} />

                            <label htmlFor='gender'>Gender:</label>
                            <select id='gender' name='gender' value={formData.gender} onChange={handleChange}>
                                <option value='male'>Male</option>
                                <option value='female'>Female</option>
                                <option value='other'>Other</option>
                            </select>

                            <label htmlFor='birthday'>Birthday:</label>
                            <input type='date' id='birthday' name='birthday' value={formData.birthday} onChange={handleChange} />

                            <label htmlFor='nationality'>Nationality:</label>
                            <input type='text' id='nationality' name='nationality' value={formData.nationality} onChange={handleChange} />

                            <label htmlFor='civilStatus'>Civil Status:</label>
                            <select id='civilStatus' name='civilStatus' value={formData.civilStatus} onChange={handleChange}>
                                <option value='single'>Single</option>
                                <option value='married'>Married</option>
                                <option value='divorced'>Divorced</option>
                                <option value='widowed'>Widowed</option>
                            </select>

                            <label htmlFor='jobPosition'>Job Position:</label>
                            <input type='text' id='jobPosition' name='jobPosition' value={formData.jobPosition} onChange={handleChange} />

                            <label htmlFor='jobLevel'>Job Level:</label>
                            <select type='text' id='jobLevel' name='jobLevel' value={formData.jobLevel} onChange={handleChange}>
                                <option value='entry'>Entry-Level/Junior</option>
                                <option value='mid'>Mid-Level/Intermediate</option>
                                <option value='senior'>Senior Level</option>
                                <option value='executive'>Executive/Leadership Level</option>
                            </select>
                            <label htmlFor='skills'>Skills:</label>
                            <textarea id='skills' name='skills' rows="3" value={formData.skills} onChange={handleChange} />
                            <div className='savingbutton'>
                                <button className='save'>Save</button>
                                <button className='cancel' onClick={onClose}>Cancel</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            {isAddModalOpen && <Add onClose={() => setIsAddModalOpen(false)} />}
        </>
    )
}

export default add
