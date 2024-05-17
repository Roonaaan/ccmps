import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "../styles/EmployeeCrud.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPlusCircle, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';


function Editeduinfo({ onClose }) {
  const [educationInfo, setEducationInfo] = useState([]);
  const [editModes, setEditModes] = useState([])

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const employeeId = sessionStorage.getItem('editEmployeeId');
      const response = await axios.get(`http://localhost:8800/api/auth/get-profileeduinfo/${employeeId}`);
      const employeeData = response.data;

      setEducationInfo(employeeData);
      // Initialize edit modes for each card
      setEditModes(new Array(employeeData.length).fill(false));
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
    // Store the ID of the card to be deleted in session storage
    sessionStorage.setItem('deleteEduInfoId', educationInfo[index].id);

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
          const deletedEduId = sessionStorage.getItem('deleteEduInfoId');
          const editEmployeeId = sessionStorage.getItem('editEmployeeId');

          // Send a request to delete the job info
          await axios.delete(`http://localhost:8800/api/auth/delete-profileeduinfo/${editEmployeeId}/${deletedEduId}`);

          // Remove the deleted job from the state
          const updatedEducationInfo = [...educationInfo];
          updatedEducationInfo.splice(index, 1);
          setEducationInfo(updatedEducationInfo);

          // Show success message
          Swal.fire(
            'Deleted!',
            'Your education history has been deleted.',
            'success'
          );
        } catch (error) {
          console.error('Error deleting edu history:', error);
          toast.error('Failed to delete edu history. Please try again.');
        }
      }
    });
  };

  const handleAddEducation = async () => {
    try {
      // Make a request to the backend to fetch the next available ID
      const response = await axios.get("http://localhost:8800/api/auth/get-next-edu-id");
      const nextEduId = response.data.nextId;

      // Create a new blank job history entry with the fetched ID
      const newEdu = {
        id: nextEduId,
        school: "",
        year_graduated: "", // Provide a default value or validate user input here
        grade_level: "",
        degree_course: ""
      };

      // Add the new job history entry to the state
      setEducationInfo([...educationInfo, newEdu]);

      // Toggle edit mode for the newly added card
      const updatedEditModes = [...editModes, true];
      setEditModes(updatedEditModes);

      // Update session storage with editJobInfoId
      sessionStorage.setItem('editEduInfoId', nextEduId);
    } catch (error) {
      console.error('Error fetching next edu ID:', error);
      toast.error('Failed to add edu history. Please try again.');
    }
  };

  const toggleEditMode = (index) => {
    const updatedEditModes = [...editModes];
    updatedEditModes[index] = !updatedEditModes[index];
    setEditModes(updatedEditModes);

    // Update session storage with editJobInfoId when edit mode is toggled
    if (updatedEditModes[index]) {
      const editEduInfoId = educationInfo[index].id;
      sessionStorage.setItem('editEduInfoId', editEduInfoId);
    }
  };

  const handleSave = async () => {
    try {
      const editEduInfoId = sessionStorage.getItem('editEduInfoId');
      const editEmployeeId = sessionStorage.getItem('editEmployeeId');

      // Get job info from state based on editJobInfoId
      const eduInfoToUpdate = educationInfo.find(edu => edu.id === parseInt(editEduInfoId));

      // Destructure jobInfoToUpdate to get individual fields
      const { school, year_graduated: yearGraduated, grade_level: gradeLevel, degree_course: degreeCourse } = eduInfoToUpdate;

      // Send the extracted job info to the backend
      await axios.post(`http://localhost:8800/api/auth/edit-profileeduinfo/${editEmployeeId}`, {
        school,
        yearGraduated,
        gradeLevel,
        degreeCourse
      }, {
        params: {
          editEduInfoId: editEduInfoId
        }
      });

      toast.success('Edu history saved successfully!');
    } catch (error) {
      console.error('Error saving Edu history:', error);
      toast.error('Failed to save Edu history. Please try again.');
    }
  };

  const handleSaveNewData = async (newEdu) => {
    try {
      const editEmployeeId = sessionStorage.getItem('editEmployeeId');

      // Send the new job info to the backend for saving
      await axios.post(`http://localhost:8800/api/auth/add-profileeduinfo/${editEmployeeId}`, {
        ...newEdu  // Spread the newJob object to include all fields
      });

      toast.success('New edu history saved successfully!');
    } catch (error) {
      console.error('Error saving new edu history:', error);
      toast.error('Failed to save new edu history. Please try again.');
    }
  };

  return (
    <>
      <div className="employee-modal-overlay">
        <div className="employee-modal">
          <h2>Employee Education Information</h2>
          {educationInfo.map((edu, index) => (
            <div key={index} className="education-info-card">
              <div className="education-info-card-header">
                <label htmlFor={`school-${index}`}>Institution: </label>
                {editModes[index] ? ( // Render edit or save button based on edit mode
                  <button onClick={() => toggleEditMode(index)}><FontAwesomeIcon icon={faSave} onClick={handleSave} /></button>
                ) : (
                  <button onClick={() => {
                    toggleEditMode(index);
                    sessionStorage.setItem('editEduInfoIndex', edu.id);
                  }}><FontAwesomeIcon icon={faEdit} /></button>
                )}
                <button onClick={() => handleDelete(index)}><FontAwesomeIcon icon={faTrashCan} /></button>
              </div>
              {editModes[index] ? (
                <input
                  type="text"
                  id={`school-${index}`}
                  value={edu.school}
                  onChange={(e) => handleChange(index, 'school', e.target.value)}
                />
              ) : (
                <p>{edu.school}</p>
              )}
              {/* Render other job details based on edit mode */}
              {editModes[index] ? (
                <>
                  <label htmlFor={`yearGraduated-${index}`}>Year Graduated: </label>
                  <input
                    type="number"
                    id={`yearGraduated-${index}`}
                    value={edu.year_graduated}
                    onChange={(e) => handleChange(index, 'year_graduated', e.target.value)}
                  />

                  <label htmlFor={`gradeLevel-${index}`}>Grade Level: </label>
                  <input
                    type="text"
                    id={`gradeLevel-${index}`}
                    value={edu.grade_level}
                    onChange={(e) => handleChange(index, 'grade_level', e.target.value)}
                  />

                  <label htmlFor={`degree-${index}`}>Degree: </label>
                  <input
                    type="text" id={`degree-${index}`}
                    value={edu.degree_course}
                    onChange={(e) => handleChange(index, 'degree_course', e.target.value)}
                  />
                </>
              ) : (
                <>
                  <p><strong>Year Graduated:</strong> {edu.year_graduated}</p>
                  <p><strong>Grade Level:</strong> {edu.grade_level}</p>
                  <p><strong>Degree:</strong> {edu.degree_course}</p>
                </>
              )}
            </div>
          ))}
          <button onClick={handleAddEducation}><FontAwesomeIcon icon={faPlusCircle} />Add Education Background</button>
          <button onClick={() => handleSaveNewData(educationInfo[educationInfo.length - 1])}>Save New Data</button>
          <button onClick={onClose} className='close'>&times;</button>
        </div>
      </div>
    </>
  );
}

export default Editeduinfo;
