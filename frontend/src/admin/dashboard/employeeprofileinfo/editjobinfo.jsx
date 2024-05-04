import React, { useState, useEffect } from 'react'
import axios from 'axios'

import "../styles/EmployeeCrud.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPlusCircle } from '@fortawesome/free-solid-svg-icons';


function editjobinfo({ onClose }) {
    const [jobInfo, setJobInfo] = useState([]);

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const fetchEmployeeData = async () => {
        try {
            const employeeId = sessionStorage.getItem('editEmployeeId');
            const response = await axios.get(`https://ccmps-server-node.vercel.app/api/auth/get-profilejobinfo/${employeeId}`);
            const employeeData = response.data;

            setJobInfo(employeeData);
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    const handleChange = (index, field, value) => {
        const updatedJobInfo = [...jobInfo];
        updatedJobInfo[index][field] = value;
        setJobInfo(updatedJobInfo);
    };

    const handleDelete = (index) => {
        const updatedJobInfo = [...jobInfo];
        updatedJobInfo.splice(index, 1);
        setJobInfo(updatedJobInfo);
    };

    const handleAddJob = () => {
        setJobInfo([...jobInfo, {}]);
    };

    const handleSave = async () => {
        try {
            const employeeId = sessionStorage.getItem('editEmployeeId');
            await axios.post(`https://ccmps-server-node.vercel.app/api/auth/edit-profilejobinfo/${employeeId}`, jobInfo);
            toast.success('Job history saved successfully!');
        } catch (error) {
            console.error('Error saving Job history:', error);
            toast.error('Failed to save Job history. Please try again.');
        }
    };

    return (
        <>
            <div className="employee-modal-overlay">
                <div className="employee-modal">
                    <h2>Employee Job History</h2>
                    {jobInfo.map((job, index) => (
                        <div key={index} className="education-info-card">
                            <label htmlFor={`company-${index}`}>Company Name: </label>
                            <input type="text" id={`company-${index}`} value={job.company} onChange={(e) => handleChange(index, 'company', e.target.value)} />

                            <label htmlFor={`jobTitle-${index}`}>Position: </label>
                            <input type="text" id={`jobTitle-${index}`} value={job.job_title} onChange={(e) => handleChange(index, 'job_title', e.target.value)} />

                            <label htmlFor={`skills-${index}`}>Skills Obtained: </label>
                            <textarea
                                id={`skills-${index}`}
                                rows={5} // Specify the number of rows
                                value={job.skills}
                                onChange={(e) => handleChange(index, 'skills', e.target.value)} // Update the 'skills' field
                            />

                            <label htmlFor={`companyAddress-${index}`}>Company Address: </label>
                            <input type="text" id={`companyAddress-${index}`} value={job.company_address} onChange={(e) => handleChange(index, 'company_address', e.target.value)} />

                            <label htmlFor={`startDate-${index}`}>Start Date: </label>
                            <input type="date" id={`startDate-${index}`} value={job.start_date} onChange={(e) => handleChange(index, 'start_date', e.target.value)} />

                            <label htmlFor={`endDate-${index}`}>End Date: </label>
                            <input type="date" id={`endDate-${index}`} value={job.end_date} onChange={(e) => handleChange(index, 'end_date', e.target.value)} />

                            <button onClick={() => handleDelete(index)}><FontAwesomeIcon icon={faTrashCan} /></button>
                        </div>
                    ))}
                    <button onClick={handleAddJob}><FontAwesomeIcon icon={faPlusCircle} />Add Job History</button>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={onClose} className='close'>&times;</button>
                </div>
            </div>
        </>
    )
}

export default editjobinfo