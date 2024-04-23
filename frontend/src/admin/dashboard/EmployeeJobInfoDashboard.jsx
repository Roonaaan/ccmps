import React, { useState, useEffect } from 'react'
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import Edit from './employeejobinfo_crud/edit';

function EmployeeJobInfoDashboard() {
    const [employees, setEmployees] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const storedEmployees = sessionStorage.getItem('jobinfo');
        if (storedEmployees) {
            // If employees exist in session storage, use them directly
            setEmployees(JSON.parse(storedEmployees));
        } else {
            // Fetch employees from the backend if not available in session storage
            fetchEmployees();
        }
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:8800/api/auth/read-jobinfo');
            const fetchedEmployees = response.data.map(employee => ({
                ...employee,
            }));
            // Store fetched employees in session storage
            sessionStorage.setItem('jobinfo', JSON.stringify(fetchedEmployees));
            setEmployees(fetchedEmployees);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const toggleEditModal = (employeeId) => {
        sessionStorage.setItem('editEmployeeId', employeeId);
        setIsEditModalOpen(!isEditModalOpen);
    };

    useEffect(() => {
        if (employees.length === 0) {
            fetchEmployees();
        }
    }, [employees]);

    return (
        <>
            <div className='employee-dashboard-main-frame'>
                <div className='employee-table'>
                    <div className='header-box'>
                        <h1>Employee Job Information</h1>
                    </div>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Full Name</th>
                                    <th>Job Position</th>
                                    <th>Job Level</th>
                                    <th>Skills</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map(employee => (
                                    <tr key={employee.employee_id}>
                                        <td>{employee.employee_id}</td>
                                        <td>{`${employee.firstname} ${employee.lastname}`}</td>
                                        <td>{employee.job_position}</td>
                                        <td>{employee.job_level}</td>
                                        <td>{employee.skills}</td>
                                        <td>
                                            <div className="employee-table-button">
                                                <button className='employee-table-edit-button' onClick={() => toggleEditModal(employee.employee_id)}> <FontAwesomeIcon icon={faEdit} /> </button>
                                                <button className='employee-table-delete-button'> <FontAwesomeIcon icon={faTrash} /> </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {isEditModalOpen && <Edit onClose={() => setIsEditModalOpen(false)} />}
        </>
    )
}

export default EmployeeJobInfoDashboard
