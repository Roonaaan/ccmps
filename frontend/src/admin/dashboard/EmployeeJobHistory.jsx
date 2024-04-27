import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import Edit from './employeejobinfo_crud/edit';

function EmployeeJobHistory() {
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
            const response = await axios.get('https://ccmps-server-node.vercel.app/api/auth/read-jobinfo');
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
                        <h1>Employee Job History</h1>
                    </div>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Level</th>
                                    <th>Job Level</th>
                                    <th>School Name</th>
                                    <th>Year Graduated</th>
                                </tr>
                            </thead>
                            
                        </table>
                    </div>
                </div>
            </div>
            {isEditModalOpen && <Edit onClose={() => setIsEditModalOpen(false)} />}
        </>
    );
}

export default EmployeeJobHistory;
