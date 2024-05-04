import React, { useState, useEffect } from 'react'
import axios from 'axios'

import "../styles/EmployeeCrud.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function edit({ onClose }) {
    const [formData, setFormData] = useState({
        image: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        birthday: '',
        role: 'Employee',
        jobPosition: '',
    });

    useEffect(() => {
        const employeeId = sessionStorage.getItem('editEmployeeId');
        console.log('Employee ID:', employeeId); // Log the employeeId
        fetchEmployeeData(employeeId);
    }, []);


    const fetchEmployeeData = async () => {
        try {
            const employeeId = sessionStorage.getItem('editEmployeeId');
            const response = await axios.get(`http://localhost:8800/api/auth/get-basicinfo/${employeeId}`);
            const employeeData = response.data;

            setFormData({
                image: `data:image/jpeg;base64,${arrayBufferToBase64(employeeData.image.data)}`,
                firstName: employeeData.firstname,
                lastName: employeeData.lastname,
                email: employeeData.email,
                phoneNumber: employeeData.phone_number,
                birthday: employeeData.birthday,
                role: employeeData.role,
                jobPosition: employeeData.job_position,
            });
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
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
            await axios.post('http://localhost:8800/api/auth/edit-basicinfo', { employee_id: employeeId, ...formData });
            onClose(); // Close the modal after successful submission
            toast.success('Successfully Changed');
        } catch (error) {
            console.error('Error editing employee information:', error);
            // Handle error
        }
    };

    const generatePassword = () => {
        const randomPassword = Math.random().toString(36).slice(-8); // Generate random password
        setFormData({ ...formData, accountPasswordPlain: randomPassword }); // Update form data with plain password
    };

    return (
        <>
            <div className="employee-modal-overlay">
                <div className="employee-modal">
                    <h2>Edit Employee</h2>
                    <span className='close' onClick={onClose} >&times;</span>
                    <form onSubmit={handleSubmit}>
                        <div className="employee-image">
                            <img src={formData.image} alt="image" style={{ width: '50px', height: '50px' }} />
                            <div className="employee-image-upload">
                                <label htmlFor='image'>Upload Image:</label>
                                <input type='file' id='image' name='image' accept='image/*' onChange={handleImageChange} />
                            </div>
                        </div>

                        <label htmlFor='firstName'>First Name:</label>
                        <input type='text' id='firstName' name='firstName' value={formData.firstName} onChange={handleChange} />

                        <label htmlFor='lastName'>Last Name:</label>
                        <input type='text' id='lastName' name='lastName' value={formData.lastName} onChange={handleChange} />

                        <label htmlFor='email'>Email:</label>
                        <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} />

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
                </div>
            </div>
        </>
    )
}

export default edit
