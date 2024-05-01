import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlusCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

import Add from './employeejobhistory_crud/add';
import Edit from './employeejobhistory_crud/edit';

function EmployeeJobHistory() {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const storedEmployees = sessionStorage.getItem('jobhistory');
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
            const response = await axios.get('http://localhost:8800/api/auth/read-jobhistory');
            const fetchedEmployees = response.data.map(employee => ({
                ...employee,
            }));
            // Store fetched employees in session storage
            sessionStorage.setItem('jobhistory', JSON.stringify(fetchedEmployees));
            setEmployees(fetchedEmployees);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const toggleAddModal = () => {
        setIsAddModalOpen(!isAddModalOpen);
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

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleDelete = async (employeeId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this employee data!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.post('http://localhost:8800/api/auth/delete-jobhistory', { employeeId });
                    fetchEmployees();
                    toast.success('Successfully Deleted');
                } catch (error) {
                    console.error('Error deleting employee:', error);
                }
            }
        });
    };

    const handleSearch = () => {
        const filtered = employees.filter(employee =>
            `${employee.firstname} ${employee.lastname}`.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredEmployees(filtered);
    };

    return (
        <>
            <ToastContainer />
            <div className='employee-dashboard-main-frame'>
                <div className='employee-table'>
                    <div className='header-box'>
                        <h1>Employee Job History</h1>
                    </div>
                    <div className="header-box-functions">
                        <div className="search-bar">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name..."
                            />
                            <button onClick={handleSearch}><FontAwesomeIcon icon={faSearch} /></button>
                        </div>
                        <button className='employee-table-add-button' onClick={toggleAddModal}> <FontAwesomeIcon icon={faPlusCircle} /> Add </button>
                    </div>
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Job Title</th>
                                    <th>Company</th>
                                    <th>Company Address</th>
                                    <th>Skills</th>
                                    <th>Start and End Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(searchQuery.length > 0 ? filteredEmployees : employees).map(employee => (
                                    <tr key={employee.employee_id}>
                                        <td>{`${employee.firstname} ${employee.lastname}`}</td>
                                        <td>{employee.job_title}</td>
                                        <td>{employee.company}</td>
                                        <td>{employee.company_address}</td>
                                        <td>{employee.skills}</td>
                                        <td>{`${employee.start_date ? formatDate(employee.start_date) : ''} - ${employee.end_date ? formatDate(employee.end_date) : ''}`}</td>
                                        <td>
                                            <div className="employee-table-button">
                                                <button className='employee-table-edit-button' onClick={() => toggleEditModal(employee.employee_id)}> <FontAwesomeIcon icon={faEdit} /> </button>
                                                <button className='employee-table-delete-button' onClick={() => handleDelete(employee.employee_id)}> <FontAwesomeIcon icon={faTrash} /> </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {isAddModalOpen && <Add onClose={() => setIsAddModalOpen(false)} />}
            {isEditModalOpen && <Edit onClose={() => setIsEditModalOpen(false)} />}
        </>
    );
}

export default EmployeeJobHistory;
