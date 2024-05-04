import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "../styles/EmployeeCrud.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPlusCircle } from '@fortawesome/free-solid-svg-icons';


function Editeduinfo({ onClose }) {
    const [educationInfo, setEducationInfo] = useState([]);

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const fetchEmployeeData = async () => {
        try {
            const employeeId = sessionStorage.getItem('editEmployeeId');
            const response = await axios.get(`https://ccmps-server-node.vercel.app/api/auth/get-profileeduinfo/${employeeId}`);
            const employeeData = response.data;

            setEducationInfo(employeeData);
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    const handleChange = (index, field, value) => {
        const updatedEducationInfo = [...educationInfo];
        updatedEducationInfo[index][field] = value;
        setEducationInfo(updatedEducationInfo);
    };

    const handleDelete = (index) => {
        const updatedEducationInfo = [...educationInfo];
        updatedEducationInfo.splice(index, 1);
        setEducationInfo(updatedEducationInfo);
    };

    const handleAddEducation = () => {
        setEducationInfo([...educationInfo, {}]);
    };

    const handleSave = async () => {
        try {
            const employeeId = sessionStorage.getItem('editEmployeeId');
            await axios.post(`https://ccmps-server-node.vercel.app/api/auth/edit-profileeduinfo/${employeeId}`, educationInfo);
            toast.success('Education information saved successfully!');
        } catch (error) {
            console.error('Error saving education information:', error);
            toast.error('Failed to save education information. Please try again.');
        }
    };

    return (
        <>
            <div className="employee-modal-overlay">
                <div className="employee-modal">
                    <h2>Employee Education Information</h2>
                    {educationInfo.map((edu, index) => (
                        <div key={index} className="education-info-card">
                            <label htmlFor={`school-${index}`}>Institution: </label>
                            <input type="text" id={`school-${index}`} value={edu.school} onChange={(e) => handleChange(index, 'school', e.target.value)} />

                            <label htmlFor={`yearGraduated-${index}`}>Year Graduated: </label>
                            <input type="number" id={`yearGraduated-${index}`} value={edu.year_graduated} onChange={(e) => handleChange(index, 'year_graduated', e.target.value)} />

                            <label htmlFor={`gradeLevel-${index}`}>Grade Level: </label>
                            <input type="text" id={`gradeLevel-${index}`} value={edu.grade_level} onChange={(e) => handleChange(index, 'grade_level', e.target.value)} />

                            <label htmlFor={`degree-${index}`}>Degree: </label>
                            <input type="text" id={`degree-${index}`} value={edu.degree_course} onChange={(e) => handleChange(index, 'degree_course', e.target.value)} />

                            <button onClick={() => handleDelete(index)}><FontAwesomeIcon icon={faTrashCan} /></button>
                        </div>
                    ))}
                    <button onClick={handleAddEducation}><FontAwesomeIcon icon={faPlusCircle} />Add Education Background</button>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={onClose} className='close'>&times;</button>
                </div>
            </div>
        </>
    );
}

export default Editeduinfo;