import React, { useState, useEffect } from 'react';

import "../styles/EmployeeCrud.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Add({ onClose }) {
    const [employeeId, setEmployeeId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        image: '',
        firstName: '',
        lastName: '',
        email: '',
        accountPasswordPlain: '',
        phoneNumber: '',
        birthday: '',
        role: 'Employee',
        jobPosition: '',

    });

    useEffect(() => {
        fetchEmployeeId();
    }, []);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        if (name === 'image') {
            const file = e.target.files[0];
            const base64String = await convertFileToBase64(file);
            setFormData({ ...formData, [name]: base64String });
        } else {
            setFormData({ ...formData, [name]: value });
        }
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
            // Check if age is below 18
            const dob = new Date(formData.birthday);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            if (age < 18) {
                toast.error('Age must be 18 or above');
                return;
            }

            // Send request with plain password
            const response = await fetch('http://localhost:8800/api/auth/add-basicinfo', {
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

    const generatePassword = () => {
        const randomPassword = Math.random().toString(36).slice(-8); // Generate random password
        setFormData({ ...formData, accountPasswordPlain: randomPassword }); // Update form data with plain password
    };

    // Function to convert image file to base64 string
    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => {
                reject(error);
            };
        });
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
                            <label htmlFor='image'>Upload Image:</label>
                            <input type='file' id='image' name='image' accept='image/*' onChange={handleChange} />

                            <label htmlFor='firstName'>First Name:</label>
                            <input type='text' id='firstName' name='firstName' value={formData.firstName} onChange={handleChange} />

                            <label htmlFor='lastName'>Last Name:</label>
                            <input type='text' id='lastName' name='lastName' value={formData.lastName} onChange={handleChange} />

                            <label htmlFor='email'>Email:</label>
                            <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} />

                            <div className="password-actions">
                                <label htmlFor='accountPasswordPlain'>Password:</label>
                                <button type="button" onClick={generatePassword}>Generate Password</button>
                                {formData.accountPasswordPlain && <p>Generated Password: {formData.accountPasswordPlain}</p>}
                            </div>

                            <label htmlFor='employeeId'>Employee ID:</label>
                            <input type='text' id='employeeId' name='employeeId' value={employeeId} readOnly />

                            <label htmlFor='birthday'>Birthday:</label>
                            <input type='date' id='birthday' name='birthday' value={formData.birthday} onChange={handleChange} max={new Date().toISOString().split('T')[0]} />

                            <label htmlFor='role'>Role</label>
                            <select type="text" id='role' name='role' value={formData.role} onChange={handleChange} >
                                <option value='Employee'>Employee</option>
                                <option value='HR Coordinator'>HR Coordinator</option>
                                <option value='HR Manager'>HR Manager</option>
                            </select>

                            <label htmlFor='phoneNumber'>Phone Number</label>
                            <input
                                type='tel'
                                id='phoneNumber'
                                name='phoneNumber'
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                pattern="^(\+?63|0)9\d{2}-\d{3}-\d{4}$"
                                title="Please enter a valid Philippine phone number, e.g., +63 909-090-9090 or 0909-090-9090"
                                required
                            />

                            <label htmlFor='jobPosition'>Job Position:</label>
                            <input type='text' id='jobPosition' name='jobPosition' value={formData.jobPosition} onChange={handleChange} />

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