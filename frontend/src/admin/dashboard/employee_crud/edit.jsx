import React, { useState, useEffect } from 'react'

import "./style.css"

function edit({ onClose }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <div className="edit-employee-modal-overlay">
        <div className="edit-employee-modal">
          <h2>Edit Employee</h2>
          <span className='close' onClick={onClose} >&times;</span>
          <form>
            <label htmlFor='employeeId'>Employee ID:</label>
            <input type='text' id='employeeId' name='employeeId' />

            <label htmlFor='image'>Upload Image:</label>
            <input type='file' id='image' name='image' accept='image/*' />

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
            <select type='text' id='jobLevel' name='jobLevel'>
              <option value='entry'>Entry-Level/Junior</option>
              <option value='mid'>Mid-Level/Intermediate</option>
              <option value='senior'>Senior Level</option>
              <option value='executive'>Executive/Leadership Level</option>
            </select>
            <label htmlFor='skills'>Skills:</label>
            <textarea id='skills' name='skills' rows='3'></textarea>
            <div className='savingbutton'>
              <button className='save'>Save</button>
              <button className='cancel'>Cancel</button>
            </div>
          </form>
        </div>
      </div>
      {isEditModalOpen && <Edit onClose={() => setIsEditModalOpen(false)} />}
    </>
  )
}

export default edit
