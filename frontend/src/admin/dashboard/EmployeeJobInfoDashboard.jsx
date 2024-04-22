import React, { useState, useEffect } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import Add from './employeejobinfo_crud/add';
import Edit from './employeejobinfo_crud/edit';

function EmployeeJobInfoDashboard() {
    const [employees, setEmployees] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <>
            <div className='employee-dashboard-main-frame'>
                <div className='employee-table'>
                    <div className='header-box'>
                        <h1>Employee Job Information</h1>
                        <button className='employee-table-add-button'> <FontAwesomeIcon icon={faPlusCircle} /> Add </button>
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
                        </table>
                    </div>
                </div>
            </div>
            {isAddModalOpen && <Add onClose={() => setIsAddModalOpen(false)} />}
            {isEditModalOpen && <Edit onClose={() => setIsEditModalOpen(false)} />}
        </>
    )
}

export default EmployeeJobInfoDashboard
