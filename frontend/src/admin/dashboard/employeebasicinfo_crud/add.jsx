import React, { useState, useEffect } from 'react';

import "../styles/EmployeeCrud.css";

function Add({ onClose }) {
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
        gender: 'Male',
        birthday: '',
        nationality: '',
        civilStatus: 'Single' 
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
            const response = await fetch('http://localhost:8800/api/auth/add-basicinfo', {
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
            <div className="employee-modal-overlay">
                <div className="employee-modal">
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
                                <option value='Male'>Male</option>
                                <option value='Female'>Female</option>
                                <option value='Other'>Other</option>
                            </select>

                            <label htmlFor='birthday'>Birthday:</label>
                            <input type='date' id='birthday' name='birthday' value={formData.birthday} onChange={handleChange} />

                            <label htmlFor='nationality'>Nationality:</label>
                            <input type='text' id='nationality' name='nationality' value={formData.nationality} onChange={handleChange} />

                            <label htmlFor='civilStatus'>Civil Status:</label>
                            <select id='civilStatus' name='civilStatus' value={formData.civilStatus} onChange={handleChange}>
                                <option value='Single'>Single</option>
                                <option value='Married'>Married</option>
                                <option value='Divorced'>Divorced</option>
                                <option value='Widowed'>Widowed</option>
                            </select>

                            <div className='savingbutton'>
                                <button className='save'>Save</button>
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
