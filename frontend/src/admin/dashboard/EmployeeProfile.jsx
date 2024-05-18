import React, { useState, useEffect } from 'react'
import axios from 'axios'

import "./styles/Employee.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

import EditBasicInfo from './employeeprofileinfo/editbasicinfo';
import EditPersonalInfo from './employeeprofileinfo/editpersonalinfo';
import EditEduInfo from './employeeprofileinfo/editeduinfo';
import EditJobInfo from './employeeprofileinfo/editjobinfo';

function EmployeeProfile({ onClose }) {
    const [employeeData, setEmployeeData] = useState(null);
    const [isEditBasicInfoModalOpen, setIsEditBasicInfoModalOpen] = useState(false);
    const [isEditPersonalInfoModalOpen, setIsEditPersonalInfoModalOpen] = useState(false);
    const [isEditJobInfoModalOpen, setIsEditJobInfoModalOpen] = useState(false);
    const [isEditEduInfoModalOpen, setIsEditEduInfoModalOpen] = useState(false);

    useEffect(() => {
        const fetchEmployeeProfile = async () => {
            try {
                const employeeId = sessionStorage.getItem('editEmployeeId');
                const response = await axios.get(`https://ccmps-server-node.vercel.app/api/auth/read-employeeprofile/${employeeId}`);

                // Convert image ArrayBuffer to base64
                const base64Image = arrayBufferToBase64(response.data.profile.image.data);
                response.data.profile.image = `data:image/jpeg;base64,${base64Image}`;

                setEmployeeData(response.data);
            } catch (error) {
                console.error('Error fetching employee profile:', error);
                toast.error('Error fetching employee profile. Please try again later.');
            }
        };

        fetchEmployeeProfile();
    }, []);

    const toggleEditBasicInfoModal = (employeeId) => {
        sessionStorage.setItem("editEmployeeId", employeeId);
        setIsEditBasicInfoModalOpen(!isEditBasicInfoModalOpen);
    };

    const toggleEditPersonalInfoModal = (employeeId) => {
        sessionStorage.setItem("editEmployeeId", employeeId);
        setIsEditPersonalInfoModalOpen(!isEditPersonalInfoModalOpen);
    };

    const toggleEditEduInfoModal = (employeeId) => {
        sessionStorage.setItem("editEmployeeId", employeeId);
        setIsEditEduInfoModalOpen(!isEditEduInfoModalOpen);
    };

    const toggleEditJobInfoModal = (employeeId) => {
        sessionStorage.setItem("editEmployeeId", employeeId);
        setIsEditJobInfoModalOpen(!isEditJobInfoModalOpen);
    };

    function arrayBufferToBase64(buffer) {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <>
            {employeeData && (
                <div className="employee-profile-modal-overlay">
                    <div className="employee-profile-modal">
                        <h2>Employee Profile</h2>
                        <span className='close' onClick={onClose} >&times;</span>
                        <div className="employee-profile-basicinfo-card">
                            <div className="employee-profile-basicinfo-card-body">
                                <div className="employee-profile-basicinfo-card-body-row">
                                    <div className="employee-profile-basicinfo-image">
                                        <img src={employeeData.profile.image} alt="Profile" />
                                    </div>
                                    <div className="employee-profile-basicinfo-basic">
                                        <h1>{employeeData.profile.firstname} {employeeData.profile.lastname}</h1>
                                        <p>{employeeData.profile.job_position}</p>
                                        <h2>Employee ID: {employeeData.profile.employee_id}</h2>
                                    </div>
                                    <div className="employee-profile-basicinfo-other">
                                        <ul className='basic-info'>
                                            <li>
                                                <div className="basic-info-title">Phone: </div>
                                                <div className="basic-info-text"> {employeeData.profile.phone_number} </div>
                                            </li>
                                            <li>
                                                <div className="basic-info-title">Email: </div>
                                                <div className="basic-info-text"> {employeeData.profile.email} </div>
                                            </li>
                                            <li>
                                                <div className="basic-info-title">Birthday: </div>
                                                <div className="basic-info-text">{employeeData.profile.birthday ? formatDate(employeeData.profile.birthday) : ''}</div>
                                            </li>
                                            <li>
                                                <div className="basic-info-title">Address: </div>
                                                <div className="basic-info-text"> {employeeData.profile.home_address} District {employeeData.profile.district}, {employeeData.profile.city} {employeeData.profile.postal_code} {employeeData.profile.province} </div>
                                            </li>
                                            <li>
                                                <div className="basic-info-title">Gender: </div>
                                                <div className="basic-info-text"> {employeeData.profile.gender} </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="employee-profile-basicinfo-edit-button">
                                        <button onClick={() => toggleEditBasicInfoModal(employeeData.profile.employee_id)}><FontAwesomeIcon icon={faPencil} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="employee-profile-personalinfo-card">
                            <div className="employee-profile-personals-edit-button">
                                <h1> Additional Information: </h1>
                                <button onClick={() => toggleEditPersonalInfoModal(employeeData.profile.employee_id)}><FontAwesomeIcon icon={faPencil} /></button>
                            </div>

                            <div className="employee-profile-personals-card-body">
                                <div className="employee-profile-personals-card-body-row">
                                    <div className="employee-profile-personals-other">
                                        <ul className='personal-info'>
                                            <div className='additional-information-tab'>
                                                <div className='add-info-content'>
                                                    <p className="personal-info-title">Nationality: </p>
                                                    <p className="personal-info-text"> {employeeData.profile.nationality} </p>
                                                </div>
                                                <div className='add-info-content'>
                                                    <p className="personal-info-title">Civil Status: </p>
                                                    <p className="personal-info-text"> {employeeData.profile.civil_status} </p>
                                                </div>
                                                <div className='add-info-content'>
                                                    <p className="personal-info-title">Current Job Skills: </p>
                                                    <p className="personal-info-text"> {employeeData.profile.skills} </p>
                                                </div>
                                            </div>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="employee-profile-history-card-body">
                            <div className="employee-profile-workhistory-card-body">
                                <div className="employee-profile-workhistory-edit-button">
                                    <button onClick={() => toggleEditJobInfoModal(employeeData.profile.employee_id)}><FontAwesomeIcon icon={faPencil} /></button>
                                </div>
                                <h3>Work History:</h3>
                                {employeeData.workHistory.map((history, index) => (
                                    <div key={index}>
                                        <div className='work-history'>
                                            <li>
                                                <div className="work-history-info">{history.job_title} at {history.company}</div>
                                            </li>
                                            <li>
                                                <div className="work-history-year">{`${history.start_date ? formatDate(history.start_date) : ''} - ${history.end_date ? formatDate(history.end_date) : ''}`}</div>
                                            </li>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="employee-profile-eduhistory-card-body">
                                <div className="employee-profile-eduhistory-edit-button">
                                    <button onClick={() => toggleEditEduInfoModal(employeeData.profile.employee_id)}><FontAwesomeIcon icon={faPencil} /></button>
                                </div>
                                <h3>Educational History:</h3>
                                {employeeData.educBackground.map((history, index) => (
                                    <div key={index}>
                                        <div className='edu-history'>
                                            <li>
                                                <div className="edu-history-school">{history.school}</div>
                                            </li>
                                            <li>
                                                <div className="edu-history-course">{history.degree_course}</div>
                                            </li>
                                            <li>
                                                <div className="edu-history-course">{history.year_graduated}</div>
                                            </li>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isEditBasicInfoModalOpen && <EditBasicInfo onClose={() => setIsEditBasicInfoModalOpen(false)} />}
            {isEditPersonalInfoModalOpen && <EditPersonalInfo onClose={() => setIsEditPersonalInfoModalOpen(false)} />}
            {isEditJobInfoModalOpen && <EditJobInfo onClose={() => setIsEditJobInfoModalOpen(false)} />}
            {isEditEduInfoModalOpen && <EditEduInfo onClose={() => setIsEditEduInfoModalOpen(false)} />}
        </>
    )
}


export default EmployeeProfile