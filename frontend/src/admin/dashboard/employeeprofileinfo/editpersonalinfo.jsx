import React, { useState, useEffect } from 'react'
import axios from 'axios'

import "../styles/EmployeeCrud.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function editpersonalinfo({ onClose }) {
    const [formData, setFormData] = useState({
        nationality: '',
        civilStatus: 'Single',
        skills: ''
    });

    useEffect(() => {
        const employeeId = sessionStorage.getItem('editEmployeeId');
        console.log('Employee ID:', employeeId); // Log the employeeId
        fetchEmployeeData(employeeId);
    }, []);


    const fetchEmployeeData = async () => {
        try {
            const employeeId = sessionStorage.getItem('editEmployeeId');
            const response = await axios.get(`https://ccmps-server-node.vercel.app/api/auth/get-profilepersonalinfo/${employeeId}`);
            const employeeData = response.data;

            setFormData({
                nationality: employeeData.nationality,
                civilStatus: employeeData.civil_status,
                skills: employeeData.skills,
            });
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const employeeId = sessionStorage.getItem('editEmployeeId');
            await axios.post('https://ccmps-server-node.vercel.app/api/auth/edit-profilepersonalinfo', { employee_id: employeeId, ...formData });
            onClose(); // Close the modal after successful submission
            toast.success('Successfully Changed');
        } catch (error) {
            console.error('Error editing employee information:', error);
            // Handle error
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };
    return (
        <>
            <div className="employee-modal-overlay">
                <div className="employee-modal">
                    <h2>Edit Additional Information</h2>
                    <span className='close' onClick={onClose} >&times;</span>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor='nationality'>Nationality:</label>
                        <input type='text' id='nationality' name='nationality' value={formData.nationality} onChange={handleChange} />

                        <label htmlFor='civilStatus'>Civil Status:</label>
                        <select type="text" id='civilStatus' name='civilStatus' value={formData.civilStatus} onChange={handleChange} >
                            <option value='Single'>Single</option>
                            <option value='Married'>Married</option>
                            <option value='Divorced'>Divorced</option>
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

export default editpersonalinfo