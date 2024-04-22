import express from "express";
import {
        login, sendEmail, getUserProfile, getUserDetails,
        sendResetEmail, resendResetEmail, getAssessment, getUserJob, 
        saveJob, maxPhaseNumber, getQuestions, getAnswerStored,
        retrieveAnswer, savePhaseNumber, getPhaseNumber, adminLogin,
        employeeID, addEmployee, readEmployeeList, deleteEmployeeList
} from "../controller/auth.js";

const router = express.Router();
 
// User Side Routes
// Route for user login
router.post("/login", login);

// Route for sending email
router.post("/send-email", sendEmail);

// Route for sending reset password email
router.post("/reset-password", sendResetEmail);

// Route for resending reset password email
router.post("/resend-email", resendResetEmail);

// Route for fetching user profile
router.get("/user-profile", getUserProfile);

// Route for getting user info
router.get("/user-details", getUserDetails);

// Route for Getting User Selected Job
router.get("/get-job", getUserJob);

// Route for Selected Job to store on Database
router.post("/save-job", saveJob);

// Route for Video Assesment
router.get("/max-phase", maxPhaseNumber);

// Route for Video Assesment
router.get("/assessments", getAssessment);

// Route for Q&A Assesment (question)
router.get("/questions", getQuestions);

// Route for storing answer
router.post("/answers", getAnswerStored);

// Route for retrieving answer
router.get("/retrieve-answers", retrieveAnswer); //temporarily disabled

// Route for storing answer
router.post("/save-phase", savePhaseNumber);

// Route for retrieving answer
router.get("/get-phase", getPhaseNumber);

// Admin Side Routes
// Route for admin login
router.post("/admin-login", adminLogin);

// Employee List CRUD Routes
// Create
router.get("/employeeid", employeeID);
router.post("/add-employee", addEmployee);

// Read
router.get("/read-employee", readEmployeeList);

// Update

// Delete
router.post("/delete-employee", deleteEmployeeList);
export default router;