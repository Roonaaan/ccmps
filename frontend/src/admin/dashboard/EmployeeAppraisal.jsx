import React, { useState, useEffect } from "react";
import axios from "axios";
import Review from "./employeeappraisal/review";

// Assets
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function EmployeeAppraisal() {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const storedEmployees = sessionStorage.getItem("appraisalinfo");
        if (storedEmployees) {
            // If employees exist in session storage, use them directly
            setEmployees(JSON.parse(storedEmployees));
        } else {
            // Fetch employees from the backend if not available in session storage
            fetchEmployees();
        }
    }, []);

    // Check if employees are empty and fetch them if so
    useEffect(() => {
        if (employees.length === 0) {
            fetchEmployees();
        }
    }, [employees]);

    // Fetch Employee Data
    const fetchEmployees = async () => {
        try {
            const response = await axios.get(
                "https://ccmps-server-node.vercel.app/api/auth/read-appraisalbasicinfo"
            );
            const fetchedEmployees = response.data.map((employee) => ({
                ...employee,
                // Convert Buffer image data to base64 string for image display
                image: `data:image/jpeg;base64,${arrayBufferToBase64(
                    employee.image.data
                )}`,
            }));
            // Store fetched employees in session storage
            sessionStorage.setItem("appraisalinfo", JSON.stringify(fetchedEmployees));
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

    const handleSearch = () => {
        const filtered = employees.filter((employee) =>
            `${employee.firstname} ${employee.lastname}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );
        setFilteredEmployees(filtered);
    };

    const toggleAppraisalReviewModal = (employeeId, email, jobSelected) => {
        sessionStorage.setItem("editEmployeeId", employeeId);
        sessionStorage.setItem("user", email);
        sessionStorage.setItem("selectedJobTitle", jobSelected);
        setIsReviewModalOpen(!isReviewModalOpen);
    };

    return (
        <>
            <div className="employee-appraisal-main-frame">
                <div className="appraisal-table">
                    <div className="header-box">
                        <h1>Employee Appraisal</h1>
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
                    </div>
                    <div className="employee-appraisal-profile-card-parent">
                        <div className="employee-appraisal-profile-card-container">
                            {(searchQuery.length > 0 ? filteredEmployees : employees).map(
                                (employee, index) => (
                                    <div className="employee-appraisal-profile-card" key={index}>
                                        <div className="appraisal-image">
                                            <img
                                                src={employee.image}
                                                alt="Employee"
                                                style={{ width: "70px", height: "70px", }}
                                                onClick={() => toggleAppraisalReviewModal(employee.employee_id, employee.email, employee.job_selected)}
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
            {isReviewModalOpen && <Review onClose={() => setIsReviewModalOpen(false)} />}
        </>
    )
}

export default EmployeeAppraisal