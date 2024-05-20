import express from "express";
import {
        login, sendEmail, sendResetEmail, resendResetEmail, resetPassword,
        getUserProfile, getUserDetails, getUserJob, saveJob, maxPhaseNumber, getAssessment, getCourse, retryCount, getQuestions, storeAnswer, answerResult, retryAssessment, proceedAssessment, checkScore, savePhaseNumber, getPhaseNumber,
        adminLogin, getAdminProfile, employeeID,
        totalNumberBanner, chartDashboard,
        addBasicInfo, readBasicInfo, editBasicInfo, getBasicInfoById, deleteBasicInfo,
        readEmployeeProfile, editProfileBasicInfo, getProfileBasicInfoById, editProfilePersonalInfo, getProfilePersonalInfoById,
        readAppraisalBasicInfo, readAppraisalBackgroundInfo , appraisalCalculate, printAppraisal, printRejection,
        getNextJobId, addProfileJobInfo, getJobInfoById, editJobInfo, deleteProfileJobInfo,
        getNextEduId, addProfileEduInfo, getEduInfoById, editEduInfo, deleteProfileEduInfo
} from "../controller/auth.js";

const router = express.Router();
 
// User Side Routes.....................................................................................
// Route for user login
router.post("/login", login);
// Route for sending email
router.post("/send-email", sendEmail);
// Route for sending reset password email
router.post("/reset-password", sendResetEmail);
// Route for resending reset password email
router.post("/resend-email", resendResetEmail);
// Route for resetting password
router.post ("/reset-userpassword", resetPassword);


// User Logged In Routes.....................................................................................
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

// Route for Courses
router.get("/courses", getCourse);

// Route for storing retry count
router.post("/retry-count", retryCount);

// Route for Q&A Assesment (question)
router.get("/questions", getQuestions);

// Route for storing answer
router.post("/store-answer", storeAnswer);

// Route for total score percentage
router.get("/results", answerResult);

// Route for retrying assessment
router.post("/retry-assessment", retryAssessment);

// Route for proceeding
router.post("/proceed-assessment", proceedAssessment);

// Route for checking if the score is stored
router.get("/check-score", checkScore);

// Route for storing answer
router.post("/save-phase", savePhaseNumber);

// Route for retrieving answer
router.get("/get-phase", getPhaseNumber);

// Admin Side Routes.....................................................................................
// Route for admin login
router.post("/admin-login", adminLogin);
// Route for fetching admin profile
router.get("/admin-profile", getAdminProfile);
// Route for Auto Employee ID
router.get("/employeeid", employeeID);

// Admin Dashboard.....................................................................................
// Route for getting data for the Banner
router.get("/total-number", totalNumberBanner);
// Route for the Chart Data
router.get("/chart-dashboard", chartDashboard);

// Employee Dashboard Info CRUD Routes.....................................................................................
// Create
router.post("/add-basicinfo", addBasicInfo);
// Read
router.get("/read-basicinfo", readBasicInfo);
// Update
router.post("/edit-basicinfo", editBasicInfo);
router.get("/get-basicinfo/:editEmployeeId", getBasicInfoById);
// Delete
router.delete("/delete-basicinfo/:editEmployeeId", deleteBasicInfo);

// Employee Profile Route.....................................................................................
// Read
router.get("/read-employeeprofile/:editEmployeeId", readEmployeeProfile);
// Edit Basic Info
router.post("/edit-profilebasicinfo", editProfileBasicInfo);
// Edit Basic Info Autofill
router.get("/get-profilebasicinfo/:editEmployeeId", getProfileBasicInfoById);
// Edit Personal Info
router.post("/edit-profilepersonalinfo", editProfilePersonalInfo);
// Edit Personal Info Autofill
router.get("/get-profilepersonalinfo/:editEmployeeId", getProfilePersonalInfoById);

// Employee Appraisal Route.....................................................................................
// Read Employee with Pending Appraisal
router.get("/read-appraisalbasicinfo", readAppraisalBasicInfo);
// Read Employee Details for Appraisal
router.get("/read-appraisalbackgroundinfo", readAppraisalBackgroundInfo);
// Route for appraisal calculation
router.get("/calculate-appraisal", appraisalCalculate);
// Route for print pdf appraisal
router.get("/print-appraisal", printAppraisal);
// Route for print pdf appraisal
router.get("/reject-appraisal", printRejection);

// Employee Work History Route .....................................................................................
// Automatic ID
router.get("/get-next-job-id", getNextJobId);
// Create/Add
router.post('/add-profilejobinfo/:editEmployeeId', addProfileJobInfo);
// Autofill
router.get("/get-profilejobinfo/:editEmployeeId", getJobInfoById);
// Edit
router.post("/edit-profilejobinfo/:editEmployeeId", editJobInfo);
// Delete
router.delete("/delete-profilejobinfo/:editEmployeeId/:jobId", deleteProfileJobInfo);

// Employee Education Background Route.....................................................................................
// Automatic ID
router.get("/get-next-edu-id", getNextEduId);
// Create/Add
router.post('/add-profileeduinfo/:editEmployeeId', addProfileEduInfo);
// Autofill
router.get("/get-profileeduinfo/:editEmployeeId", getEduInfoById);
// Edit
router.post("/edit-profileeduinfo/:editEmployeeId", editEduInfo);
// Delete
router.delete("/delete-profileeduinfo/:editEmployeeId/:eduId", deleteProfileEduInfo);

export default router;