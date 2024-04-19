import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Assets
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

function EmployeeDashboard() {
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:8800/api/auth/read-employee');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle form submission here
    // For example, you can collect form data and send it to a server
    closeModal();
  };

  return (
    <div className='employee-dashboard-main-frame'>
      <div className='employee-table'>
        <div>
          <div className='header-box'>
            <h1>List of Employees</h1>
            <button className='employee-table-add-button' onClick={openModal}>
              <FontAwesomeIcon icon={faPlusCircle} /> Add
            </button>
          </div>
          
          {showModal && (
            <div className='modal'>
              <div className='modal-content'>
                <span className='close' onClick={closeModal}>&times;</span>
                <form onSubmit={handleFormSubmit}>
                  <label htmlFor='employeeId'>Employee ID:</label>
                  <input type='text' id='employeeId' name='employeeId' />

                

                  <label htmlFor='firstName'>First Name:</label>
                  <input type='text' id='firstName' name='firstName' />

                  <label htmlFor='lastName'>Last Name:</label>
                  <input type='text' id='lastName' name='lastName' />

                  <label htmlFor='age'>Age:</label>
                  <input type='number' id='age' name='age' />

                  <label htmlFor='email'>Email:</label>
                  <input type='email' id='email' name='email' />

                  <label htmlFor='phoneNumber'>Phone Number:</label>
                  <input type='tel' id='phoneNumber' name='phoneNumber' />

                  <label htmlFor='homeAddress'>Home Address:</label>
                  <input type='text' id='homeAddress' name='homeAddress' />

                  <label htmlFor='district'>District:</label>
                  <input type='text' id='district' name='district' />

                  <label htmlFor='city'>City:</label>
                  <input type='text' id='city' name='city' />

                  <label htmlFor='province'>Province:</label>
                  <input type='text' id='province' name='province' />

                  <label htmlFor='postalCode'>Postal Code:</label>
                  <input type='text' id='postalCode' name='postalCode' />

                  <label htmlFor='gender'>Gender:</label>
                  <select id='gender' name='gender'>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                    <option value='other'>Other</option>
                  </select>

                  <label htmlFor='birthday'>Birthday:</label>
                  <input type='date' id='birthday' name='birthday' />

                  <label htmlFor='nationality'>Nationality:</label>
                  <input type='text' id='nationality' name='nationality' />

                  <label htmlFor='civilStatus'>Civil Status:</label>
                  <select id='civilStatus' name='civilStatus'>
                    <option value='single'>Single</option>
                    <option value='married'>Married</option>
                    <option value='divorced'>Divorced</option>
                    <option value='widowed'>Widowed</option>
                  </select>

                  <label htmlFor='jobPosition'>Job Position:</label>
                  <input type='text' id='jobPosition' name='jobPosition' />

                  <label htmlFor='jobLevel'>Job Level:</label>
                  <input type='text' id='jobLevel' name='jobLevel' />

                  <label htmlFor='skills'>Skills:</label>
                  <textarea id='skills' name='skills'></textarea>
                <div className='savingbutton'>
                  <button className='save'>Save</button>
                  <button className='cancel'>Cancel</button>
                </div>
                </form>
              </div>
            </div>
          )}

          {/* Rest of the employee table */}
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
