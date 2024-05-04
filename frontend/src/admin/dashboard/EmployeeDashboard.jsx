import React, { useState, useEffect } from "react";
import axios from "axios";

// Assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faTrash,
  faPlusCircle,
  faSearch,
  faEllipsisV
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

import Add from "./employeebasicinfo_crud/add";
import Edit from "./employeebasicinfo_crud/edit";
import EmployeeProfile from "./EmployeeProfile";

function EmployeeDashboard() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(Array(employees.length).fill(false));
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedEmployees = sessionStorage.getItem("basicinfo");
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
      const response = await axios.get(
        "http://localhost:8800/api/auth/read-basicinfo"
      );
      const fetchedEmployees = response.data.map((employee) => ({
        ...employee,
        // Convert Buffer image data to base64 string for image display
        image: `data:image/jpeg;base64,${arrayBufferToBase64(
          employee.image.data
        )}`,
      }));
      // Store fetched employees in session storage
      sessionStorage.setItem("basicinfo", JSON.stringify(fetchedEmployees));
      setEmployees(fetchedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Function to convert ArrayBuffer to base64
  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  const toggleAddModal = () => {
    setIsAddModalOpen(!isAddModalOpen);
  };

  const toggleProfileModal = (employeeId) => {
    sessionStorage.setItem("editEmployeeId", employeeId);
    setIsProfileModalOpen(!isProfileModalOpen);
  };

  const toggleEditModal = (employeeId) => {
    sessionStorage.setItem("editEmployeeId", employeeId);
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleDelete = async () => {
    const employeeId = sessionStorage.getItem('editEmployeeId');

    if (!employeeId) {
      console.error('Employee ID not found in session storage');
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this employee data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Use the employeeId from session storage and construct the URL accordingly
          await axios.delete(`http://localhost:8800/api/auth/delete-basicinfo/${employeeId}`);
          fetchEmployees();
          toast.success("Successfully Deleted");
        } catch (error) {
          console.error("Error deleting employee:", error);
        }
      }
    });
  };

  // Check if employees are empty and fetch them if so
  useEffect(() => {
    if (employees.length === 0) {
      fetchEmployees();
    }
  }, [employees]);

  const handleSearch = () => {
    const filtered = employees.filter((employee) =>
      `${employee.firstname} ${employee.lastname}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const toggleMenu = (index, employeeId) => {
    const updatedMenu = [...showMenu];
    updatedMenu[index] = !updatedMenu[index];
    setShowMenu(updatedMenu);
    // Store the employeeId in session storage
    sessionStorage.setItem("editEmployeeId", employeeId);
  };

  return (
    <>
      <ToastContainer />
      <div className="employee-dashboard-main-frame">
        <div className="employee-table">
          <div className="header-box">
            <h1>Employee</h1>
          </div>
          <div className="header-box-functions">
            <div className="search-bar">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name..."
              />
              <button onClick={handleSearch}>
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
            <button
              className="employee-table-add-button"
              onClick={toggleAddModal}
            >
              {" "}
              <FontAwesomeIcon icon={faPlusCircle} /> Add{" "}
            </button>
          </div>
          <div className="employee-profile-card-parent">
            <div className="employee-profile-card-container">
              {(searchQuery.length > 0 ? filteredEmployees : employees).map(
                (employee, index) => (
                  <div className="employee-profile-card" key={index}>
                    <div className="employee-table-button">
                      <button
                        className="employee-table-ellipsis-button"
                        onClick={() => toggleMenu(index, employee.employee_id)}
                      >
                        <FontAwesomeIcon icon={faEllipsisV} />{" "}
                      </button>
                    </div>
                    {showMenu[index] && (
                      <div className="dropdown-menu">
                        <a onClick={() => {
                          toggleEditModal(employee.employee_id);
                          toggleMenu(index, employee.employee_id); // Pass the employeeId to toggleMenu
                        }}>
                          <FontAwesomeIcon icon={faPencil} />
                          Edit
                        </a>
                        <a onClick={handleDelete}>
                          <FontAwesomeIcon icon={faTrash} />
                          Delete
                        </a>
                      </div>
                    )}
                    <div className="image">
                      <img
                        src={employee.image}
                        alt="Employee"
                        style={{ width: "70px", height: "70px", }}
                        onClick={() => toggleProfileModal(employee.employee_id)}
                      />
                    </div>
                    <a>{`${employee.firstname} ${employee.lastname}`}</a>
                    <div className="company-role-text">{employee.job_position}</div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      {isAddModalOpen && <Add onClose={() => setIsAddModalOpen(false)} />}
      {isEditModalOpen && <Edit onClose={() => setIsEditModalOpen(false)} />}
      {isProfileModalOpen && <EmployeeProfile onClose={() => setIsProfileModalOpen(false)} />}
    </>
  );
}

export default EmployeeDashboard;
