import React, { useState, useEffect } from 'react'
import axios from 'axios'

import "../styles/EmployeeCrud.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function editbasicinfo({ onClose }) {
  const [formData, setFormData] = useState({
    image: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    birthday: '',
    homeAddress: '',
    district: '',
    city: '',
    province: '',
    postalCode: '',
    gender: '',
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
      const response = await axios.get(`http://localhost:8800/api/auth/get-profilebasicinfo/${employeeId}`);
      const employeeData = response.data;

      setFormData({
        image: `data:image/jpeg;base64,${arrayBufferToBase64(employeeData.image.data)}`,
        firstName: employeeData.firstname,
        lastName: employeeData.lastname,
        email: employeeData.email,
        phoneNumber: employeeData.phone_number,
        birthday: employeeData.birthday,
        homeAddress: employeeData.home_address,
        district: employeeData.district,
        city: employeeData.city,
        province: employeeData.province,
        postalCode: employeeData.postal_code,
        gender: employeeData.gender,
        jobPosition: employeeData.job_position,
      });
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const employeeId = sessionStorage.getItem('editEmployeeId');
      await axios.post('http://localhost:8800/api/auth/edit-profilebasicinfo', { employee_id: employeeId, ...formData });
      onClose(); // Close the modal after successful submission
      toast.success('Successfully Changed');
    } catch (error) {
      console.error('Error editing employee information:', error);
      // Handle error
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
          <h2>Edit Basic Information</h2>
          <span className='close' onClick={onClose} >&times;</span>
          <form onSubmit={handleSubmit}>
            <div className="employee-image">
              <img src={formData.image} alt="image" style={{ width: '50px', height: '50px' }} />
              <div className="employee-image-upload">
                <label htmlFor='image'>Upload Image:</label>
                <input type='file' id='image' name='image' accept='image/*' onChange={handleChange} />
              </div>
            </div>

            <label htmlFor='firstName'>First Name:</label>
            <input type='text' id='firstName' name='firstName' value={formData.firstName} onChange={handleChange} />

            <label htmlFor='lastName'>Last Name:</label>
            <input type='text' id='lastName' name='lastName' value={formData.lastName} onChange={handleChange} />

            <label htmlFor='jobPosition'>Job Position:</label>
            <input type='text' id='jobPosition' name='jobPosition' value={formData.jobPosition} onChange={handleChange} />

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

            <label htmlFor='email'>Email:</label>
            <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} />

            <label htmlFor='birthday'>Birthday:</label>
            <input type='date' id='birthday' name='birthday' value={formData.birthday} onChange={handleChange} max={new Date().toISOString().split('T')[0]} />

            <label htmlFor='homeAddress'>Home Address:</label>
            <input type='text' id='homeAddress' name='homeAddress' value={formData.homeAddress} onChange={handleChange} />

            <label htmlFor='district'>District:</label>
            <input type='number' id='district' name='district' value={formData.district} onChange={handleChange} />

            <label htmlFor='city'>City:</label>
            <input type='text' id='city' name='city' value={formData.city} onChange={handleChange} />

            <label htmlFor='province'>Province:</label>
            <input type='text' id='province' name='province' value={formData.province} onChange={handleChange} />

            <label htmlFor='postalCode'>Postal Code:</label>
            <input type='number' id='postalCode' name='postalCode' value={formData.postalCode} onChange={handleChange} />

            <label htmlFor='gender'>Gender</label>
            <select type="text" id='gender' name='gender' value={formData.gender} onChange={handleChange} >
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
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

export default editbasicinfo
