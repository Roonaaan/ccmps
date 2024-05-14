import React, { useState, useEffect } from 'react'
import axios from 'axios'

// Asssets
import "../styles/Employee.css";
import { Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faPrint, faBan } from '@fortawesome/free-solid-svg-icons';

function review({ onClose }) {
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [totalCorrectPercentage, setTotalCorrectPercentage] = useState(0);
    const [totalIncorrectPercentage, setTotalIncorrectPercentage] = useState(0);
    const [result, setResult] = useState("");
    const [percentage, setPercentage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [appraisalScore, setAppraisalScore] = useState(null);
    const [appraisalOutcome, setAppraisalOutcome] = useState(null);

    // Fetch Employee Details
    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const userEmail = sessionStorage.getItem('user');
                const selectedJobTitle = sessionStorage.getItem('selectedJobTitle');
                const response = await fetch(`http://localhost:8800/api/auth/read-appraisalbackgroundinfo?email=${userEmail}&job=${encodeURIComponent(selectedJobTitle)}`);
                const data = await response.json();
                if (response.ok) {
                    const employee = data[0];
                    if (employee.image) {
                        employee.image = `data:image/jpeg;base64,${arrayBufferToBase64(employee.image.data)}`;
                    }
                    setEmployeeDetails(employee); // Assuming the response contains an array of one object
                } else {
                    setError('Failed to fetch employee details');
                }
                setLoading(false);
            } catch (error) {
                console.error('An error occurred while fetching employee details:', error);
                setError('Failed to fetch employee details');
                setLoading(false);
            }
        };

        fetchEmployeeDetails();
    }, []);

    function arrayBufferToBase64(buffer) {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    // Fetch Score Percentage
    useEffect(() => {
        const fetchResult = async () => {
            try {
                const userEmail = sessionStorage.getItem('user');
                const selectedJobTitle = sessionStorage.getItem('selectedJobTitle');
                const response = await fetch(`http://localhost:8800/api/auth/results?email=${userEmail}&job=${encodeURIComponent(selectedJobTitle)}`);
                const data = await response.json();
                if (data.success) {
                    setPercentage(data.percentage);
                    setTotalQuestions(data.totalQuestions);
                    setTotalCorrectPercentage(data.totalCorrectPercentage);
                    setTotalIncorrectPercentage(data.totalIncorrectPercentage);
                    setResult(data.result);
                } else {
                    console.error('Failed to fetch assessment result');
                }
            } catch (error) {
                console.error('An error occurred while fetching assessment result:', error);
            }
        };

        fetchResult();
    }, []);

    // Graph
    const data = {
        labels: ['Correct', 'Incorrect'],
        datasets: [
            {
                data: [totalCorrectPercentage, totalIncorrectPercentage],
                backgroundColor: [
                    '#33658A',
                    '#27374D'
                ],
                hoverBackgroundColor: [
                    '#33658A',
                    '#27374D'
                ]
            }
        ]
    };

    // Calculate Appraisal Score and Result
    const handleCalculateClick = async () => {
        try {
            const userEmail = sessionStorage.getItem('user');
            const selectedJobTitle = sessionStorage.getItem('selectedJobTitle');
            const response = await axios.get(`http://localhost:8800/api/auth/calculate-appraisal?email=${userEmail}&job=${encodeURIComponent(selectedJobTitle)}`);
            const data = response.data;
            if (data.success) {
                setAppraisalScore(data.appraisalScore);
                setAppraisalOutcome(data.outcome);
            } else {
                console.error('Failed to calculate appraisal');
            }
        } catch (error) {
            console.error('An error occurred while calculating appraisal:', error);
        }
    };

    return (
        <>
            <div className="employee-profile-modal-overlay">
                <div className="employee-appraisal-profile-modal">
                    <h2>Employee Assessment Score Review</h2>
                    <span className='close' onClick={onClose}>&times;</span>
                    {employeeDetails && (
                        <div className="employee-appraisal-profile-container">
                            <div className="employee-appraisal-profile-inner">
                                <div className="employee-appraisal-profile-details">
                                    <img src={employeeDetails.image} alt="profile" style={{ width: "130px", height: "130px", }} />
                                    <div className="employee-profile-details">
                                        <ul className='profile-details'>
                                            <li>
                                                <div className="appraisalTitle">Full Name</div>
                                                :
                                                <div className="appraisalText">{`${employeeDetails.firstname} ${employeeDetails.lastname}`}</div>
                                            </li>
                                            <li>
                                                <div className="appraisalTitle">Employee ID</div>
                                                :
                                                <div className="appraisalText">{employeeDetails.employee_id}</div>
                                            </li>
                                            <li>
                                                <div className="appraisalTitle">Current Job Position</div>
                                                :
                                                <div className="appraisalText">{employeeDetails.job_position}</div>
                                            </li>
                                            <li>
                                                <div className="appraisalTitle">Job Level</div>
                                                :
                                                <div className="appraisalText">{employeeDetails.job_level}</div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="employee-appraisal-details">
                                    <div className="employee-appraisal-graph">
                                        <Doughnut data={data} />
                                    </div>
                                    <div className="employee-appraisal-contents">
                                        <div className="employee-appraisal-summary">
                                            <ul className='appraisal-summary'>
                                                <li>
                                                    <div className="appraisalTitle">Selected Job Title</div>
                                                    :
                                                    <div className="appraisalText">{employeeDetails.job_selected}</div>
                                                </li>
                                                <li>
                                                    <div className="appraisalTitle">Score</div>
                                                    :
                                                    <div className="appraisalText">{employeeDetails.score}</div>
                                                </li>
                                                <li>
                                                    <div className="appraisalTitle">Retry Count</div>
                                                    :
                                                    <div className="appraisalText">{employeeDetails.retries}</div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="employee-appraisal-details-request">
                                    <div className="employee-appraisal-request">
                                        <div className="employee-appraisal-request-summary">
                                            <ul className='appraisal-summary'>
                                                <li>
                                                    <div className="appraisalResultTitle">Calculation Result Score</div>
                                                    :
                                                    <div className="appraisalResultText">{appraisalScore !== null ? appraisalScore : 'Calculation Result Score Here'}</div>
                                                </li>
                                                <li>
                                                    <div className="appraisalResultTitle">Appraisal Result</div>
                                                    :
                                                    <div className="appraisalResultText">{appraisalOutcome !== null ? appraisalOutcome : 'Appraisal Result Here'}</div>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="appraisal-request-buttons">
                                            <button onClick={handleCalculateClick}><FontAwesomeIcon icon={faCalculator} /></button>
                                            <button><FontAwesomeIcon icon={faPrint} /></button>
                                            <button><FontAwesomeIcon icon={faBan} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default review