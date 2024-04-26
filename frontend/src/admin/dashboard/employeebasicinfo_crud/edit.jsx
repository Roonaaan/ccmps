import React, { useState, useEffect } from 'react'
import axios from 'axios'

import "../styles/EmployeeCrud.css";

function edit({ onClose }) {
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
        civilStatus: 'Single',
    });

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const fetchEmployeeData = async () => {
        try {
            const employeeId = sessionStorage.getItem('editEmployeeId');
            const response = await axios.get(`https://ccmps-server-node.vercel.app/api/auth/get-basicinfo/${employeeId}`);
            const employeeData = response.data;

            setFormData({
                image: `data:image/jpeg;base64,${arrayBufferToBase64(employeeData.image.data)}`,
                firstName: employeeData.firstname,
                lastName: employeeData.lastname,
                age: employeeData.age,
                email: employeeData.email,
                phoneNumber: employeeData.phone_number,
                homeAddress: employeeData.home_address,
                district: employeeData.district,
                city: employeeData.city,
                province: employeeData.province,
                postalCode: employeeData.postal_code,
                gender: employeeData.gender,
                birthday: employeeData.birthday,
                nationality: employeeData.nationality,
                civilStatus: employeeData.civil_status,
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
            await axios.post('https://ccmps-server-node.vercel.app/api/auth/edit-basicinfo', { employee_id: employeeId, ...formData });
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