import React, { useState, useEffect } from 'react'
import axios from 'axios'

import "./style.css"

function edit({ onClose }) {
    const [formData, setFormData] = useState({
        image: null,
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
        civilStatus: 'Single',
    });

    const handleChange = (e) => {
    if (e.target.name === 'image') {
        // If the input is an image, store the file object
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
        // For other inputs, update the form data directly
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
};

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Convert image to bytea format
            const byteaImage = await convertImageToBytea(formData.image);

            // Send form data to the backend
            const response = await axios.post('http://localhost:8800/api/auth/edit-employee', {
                ...formData,
                image: byteaImage, // Replace image field with bytea data
                employeeId: sessionStorage.getItem('editEmployeeId')
            });

            console.log(response.data); // Log response from the server

            onClose(); // Close the modal after successful update
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    const convertImageToBytea = async (image) => {
        if (!image) return null;

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                // Convert array buffer to base64 string
                const base64String = btoa(
                    new Uint8Array(event.target.result)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                );

                // Resolve with base64 string
                resolve(base64String);
            };

            reader.onerror = (error) => {
                reject(error);
            };

            // Read the file as array buffer
            reader.readAsArrayBuffer(image);
        });
    };

    return (
        <>
            <div className="edit-employee-modal-overlay">
                <div className="edit-employee-modal">
                    <h2>Edit Employee</h2>
                    <span className='close' onClick={onClose} >&times;</span>
                    <form onSubmit={handleSubmit}>
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
                </div>
            </div>
        </>
    )
}

export default edit
