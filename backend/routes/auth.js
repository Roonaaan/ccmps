import express from "express";
import {
        login, sendEmail, sendResetEmail, resendResetEmail,
        getUserProfile, getUserDetails, getUserJob, saveJob, maxPhaseNumber, getAssessment, getCourse, retryCount, getQuestions, storeAnswer, answerResult, retryAssessment, proceedAssessment, checkScore, savePhaseNumber, getPhaseNumber,
        adminLogin, getAdminProfile, appraisalCalculate, employeeID,
        addBasicInfo, readBasicInfo, editBasicInfo, getBasicInfoById, deleteBasicInfo,
        readEmployeeProfile, editProfileBasicInfo, getProfileBasicInfoById, editProfilePersonalInfo, getProfilePersonalInfoById,
        readAppraisalBasicInfo, readAppraisalBackgroundInfo
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

// Route for appraisal calculation
router.get("/calculate-appraisal", appraisalCalculate);

// Route for Auto Employee ID
router.get("/employeeid", employeeID);

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

// Employee Education Background Route.....................................................................................
{/* Disabled Since On Progress
// Route for Add Edu Info
// Route for Edit Edu Info
router.post("/edit-profileeduinfo/:editEmployeeId", editEduInfo);
// Route for Edit Edu Info Autofill
router.get("/get-profileeduinfo/:editEmployeeId", getEduInfoById);
// Route for Delete Edu Info

// Route for Add Job Info
// Route for Edit Job Info
router.post("/edit-profilejobinfo/:editEmployeeId", editEduInfo);
// Route for Edit Job Info Autofill
router.get("/get-profilejobinfo/:editEmployeeId", getJobInfoById);
// Route for Delete Job Info


// Employee Education History Route
// Create
router.post("/add-educhistory", addEduHistory);
// Read
router.get("/read-educhistory", readEduHistory);
// Update
router.post("/edit-educhistory", editEduHistory);
router.get("/get-educhistory/:editEmployeeId", getEduHistoryById);
// Delete
router.post("/delete-educhistory", deleteEduHistory);

// Employee Job History Route
// Create
router.post("/add-jobhistory", addJobHistory);
// Read
router.get("/read-jobhistory", readJobHistory);
// Update
router.post("/edit-jobhistory", editJobHistory);
router.get("/get-jobhistory/:editEmployeeId", getJobHistoryById);
// Delete
router.post("/delete-jobhistory", deleteJobHistory);

// Employee Job Info CRUD Route
// Read
router.get("/read-jobinfo", readJobInfo);
// Update
// Delete
router.post("/delete-jobinfo", deleteJobInfo);
// Employee Account Info CRUD
// Read
router.get("/read-accountinfo", readAccountInfo);
// Update
router.post("/edit-accountinfo", editAccountInfo);
router.get("/get-accountinfo/:editEmployeeId", getAccountInfoById);
// Delete
router.post("/delete-accountinfo", deleteAccountInfo);
*/}
export default router;