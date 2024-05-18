import React, { useState, useEffect } from 'react'
import axios from 'axios'

import "../styles/EmployeeCrud.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPlusCircle, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';


function editjobinfo({ onClose }) {
    const [jobInfo, setJobInfo] = useState([]);
    const [editModes, setEditModes] = useState([]); // pang track ng "Edit Mode" sa cards

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const fetchEmployeeData = async () => {
        try {
            const employeeId = sessionStorage.getItem('editEmployeeId');
            const response = await axios.get(`https://ccmps-server-node.vercel.app/api/auth/get-profilejobinfo/${employeeId}`);
            const employeeData = response.data;

            setJobInfo(employeeData);
            // Initialize edit modes for each card
            setEditModes(new Array(employeeData.length).fill(false));
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleChange = (index, field, value) => {
        const updatedJobInfo = [...jobInfo];
        updatedJobInfo[index][field] = value;
        setJobInfo(updatedJobInfo);
    };

    const handleDelete = (index) => {
        // Store the ID of the card to be deleted in session storage
        sessionStorage.setItem('deleteJobInfoId', jobInfo[index].id);

        // Display confirmation prompt using SweetAlert
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Proceed with deletion if confirmed
                    const deletedJobId = sessionStorage.getItem('deleteJobInfoId');
                    const editEmployeeId = sessionStorage.getItem('editEmployeeId');

                    // Send a request to delete the job info
                    await axios.delete(`https://ccmps-server-node.vercel.app/api/auth/delete-profilejobinfo/${editEmployeeId}/${deletedJobId}`);

                    // Remove the deleted job from the state
                    const updatedJobInfo = [...jobInfo];
                    updatedJobInfo.splice(index, 1);
                    setJobInfo(updatedJobInfo);

                    // Show success message
                    Swal.fire(
                        'Deleted!',
                        'Your job history has been deleted.',
                        'success'
                    );
                } catch (error) {
                    console.error('Error deleting job history:', error);
                    toast.error('Failed to delete job history. Please try again.');
                }
            }
        });
    };

    const handleAddJob = async () => {
        try {
            // Make a request to the backend to fetch the next available ID
            const response = await axios.get("https://ccmps-server-node.vercel.app/api/auth/get-next-job-id");
            const nextJobId = response.data.nextId;

            // Create a new blank job history entry with the fetched ID
            const newJob = {
                id: nextJobId,
                company: "",
                job_title: "",
                skills: "",
                company_address: "",
                start_date: "",
                end_date: ""
            };

            // Add the new job history entry to the state
            setJobInfo([...jobInfo, newJob]);

            // Toggle edit mode for the newly added card
            const updatedEditModes = [...editModes, true];
            setEditModes(updatedEditModes);

            // Update session storage with editJobInfoId
            sessionStorage.setItem('editJobInfoId', nextJobId);
        } catch (error) {
            console.error('Error fetching next job ID:', error);
            toast.error('Failed to add job history. Please try again.');
        }
    };

    const toggleEditMode = (index) => {
        const updatedEditModes = [...editModes];
        updatedEditModes[index] = !updatedEditModes[index];
        setEditModes(updatedEditModes);

        // Update session storage with editJobInfoId when edit mode is toggled
        if (updatedEditModes[index]) {
            const editJobInfoId = jobInfo[index].id;
            sessionStorage.setItem('editJobInfoId', editJobInfoId);
        }
    };

    const handleSave = async () => {
        try {
            const editJobInfoId = sessionStorage.getItem('editJobInfoId');
            const editEmployeeId = sessionStorage.getItem('editEmployeeId');

            // Get job info from state based on editJobInfoId
            const jobInfoToUpdate = jobInfo.find(job => job.id === parseInt(editJobInfoId));

            // Destructure jobInfoToUpdate to get individual fields
            const { company, job_title: jobTitle, skills, company_address: companyAddress, start_date: startDate, end_date: endDate } = jobInfoToUpdate;

            // Send the extracted job info to the backend
            await axios.post(`https://ccmps-server-node.vercel.app/api/auth/edit-profilejobinfo/${editEmployeeId}`, {
                company,
                jobTitle,
                skills,
                companyAddress,
                startDate,
                endDate
            }, {
                params: {
                    editJobInfoId: editJobInfoId
                }
            });

            toast.success('Job history saved successfully!');
        } catch (error) {
            console.error('Error saving Job history:', error);
            toast.error('Failed to save Job history. Please try again.');
        }
    };

    const handleSaveNewData = async (newJob) => {
        try {
            const editEmployeeId = sessionStorage.getItem('editEmployeeId');

            // Send the new job info to the backend for saving
            await axios.post(`https://ccmps-server-node.vercel.app/api/auth/add-profilejobinfo/${editEmployeeId}`, {
                ...newJob  // Spread the newJob object to include all fields
            });

            toast.success('New job history saved successfully!');
        } catch (error) {
            console.error('Error saving new job history:', error);
            toast.error('Failed to save new job history. Please try again.');
        }
    };

    return (
        <>
            <div className="employee-modal-overlay">
                <div className="employee-modal">
                    <h2>Employee Job History</h2>
                    {jobInfo.map((job, index) => (
                        <div key={index} className="education-info-card">
                            <div className="education-info-card-header">
                                <label htmlFor={`company-${index}`}>Company Name: </label>
                                {editModes[index] ? ( // Render edit or save button based on edit mode
                                    <button onClick={() => toggleEditMode(index)}><FontAwesomeIcon icon={faSave} onClick={handleSave} /></button>
                                ) : (
                                    <button onClick={() => {
                                        toggleEditMode(index);
                                        sessionStorage.setItem('editJobInfoIndex', job.id);
                                    }}><FontAwesomeIcon icon={faEdit} /></button>
                                )}
                                <button onClick={() => handleDelete(index)}><FontAwesomeIcon icon={faTrashCan} /></button>
                            </div>
                            {editModes[index] ? (
                                <input
                                    type="text"
                                    id={`company-${index}`}
                                    value={job.company}
                                    onChange={(e) => handleChange(index, 'company', e.target.value)}
                                />
                            ) : (
                                <p>{job.company}</p>
                            )}

                            {/* Render other job details based on edit mode */}
                            {editModes[index] ? (
                                <>
                                    <label htmlFor={`jobTitle-${index}`}>Position: </label>
                                    <input
                                        type="text"
                                        id={`jobTitle-${index}`}
                                        value={job.job_title}
                                        onChange={(e) => handleChange(index, 'job_title', e.target.value)}
                                    />

                                    <label htmlFor={`skills-${index}`}>Skills Obtained: </label>
                                    <textarea
                                        id={`skills-${index}`}
                                        rows={5}
                                        value={job.skills}
                                        onChange={(e) => handleChange(index, 'skills', e.target.value)}
                                    />

                                    <label htmlFor={`companyAddress-${index}`}>Company Address: </label>
                                    <input
                                        type="text"
                                        id={`companyAddress-${index}`}
                                        value={job.company_address}
                                        onChange={(e) => handleChange(index, 'company_address', e.target.value)}
                                    />

                                    <label htmlFor={`startDate-${index}`}>Start Date: </label>
                                    <input
                                        type="date"
                                        id={`startDate-${index}`}
                                        value={job.start_date}
                                        onChange={(e) => handleChange(index, 'start_date', e.target.value)}
                                    />

                                    <label htmlFor={`endDate-${index}`}>End Date: </label>
                                    <input
                                        type="date"
                                        id={`endDate-${index}`}
                                        value={job.end_date}
                                        onChange={(e) => handleChange(index, 'end_date', e.target.value)}
                                    />
                                </>
                            ) : (
                                <>
                                    <p><strong>Position:</strong> {job.job_title}</p>
                                    <p><strong>Skills Obtained:</strong> {job.skills}</p>
                                    <p><strong>Company Address:</strong> {job.company_address}</p>
                                    <p><strong>Start Date:</strong> {formatDate(job.start_date)}</p>
                                    <p><strong>End Date:</strong> {formatDate(job.end_date)}</p>
                                </>
                            )}
                        </div>
                    ))}
                    <button onClick={handleAddJob}><FontAwesomeIcon icon={faPlusCircle} />Add Job History</button>
                    <button onClick={() => handleSaveNewData(jobInfo[jobInfo.length - 1])}>Save New Data</button>
                    <button onClick={onClose} className='close'>&times;</button>
                </div>
            </div>
        </>
    )
}

export default editjobinfo