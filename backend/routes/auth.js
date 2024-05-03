import express from "express";
import {
        login, sendEmail, getUserProfile, getUserDetails,
        sendResetEmail, resendResetEmail, getAssessment, getUserJob, 
        saveJob, maxPhaseNumber, getQuestions, getAnswerStored,
        retrieveAnswer, savePhaseNumber, getPhaseNumber, adminLogin,
        employeeID, addBasicInfo, readBasicInfo, deleteBasicInfo,
        editBasicInfo, readJobInfo, readAccountInfo, getBasicInfoById,
        editJobInfo, getJobInfoById, deleteJobInfo, deleteAccountInfo,
        getAccountInfoById, editAccountInfo, readPromotionInfo, addEduHistory, 
        readEduHistory, editEduHistory, getEduHistoryById, deleteEduHistory, 
        readJobHistory, addJobHistory, editJobHistory, getJobHistoryById, 
        deleteJobHistory, getUserPromotionInfo, promoteUser, getAdminProfile, getCourse, readEmployeeProfile
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

// Route for Courses
router.get("/courses", getCourse);

// Route for Q&A Assesment (question)
router.get("/questions", getQuestions);

// Route for storing answer
router.post("/answers", getAnswerStored);

// Route for retrieving answer
router.get("/retrieve-answers", retrieveAnswer);

// Route for storing answer
router.post("/save-phase", savePhaseNumber);

// Route for retrieving answer
router.get("/get-phase", getPhaseNumber);

// Admin Side Routes
// Route for admin login
router.post("/admin-login", adminLogin);
 
// Route for fetching admin profile
router.get("/admin-profile", getAdminProfile);

// Route for Auto Employee ID
router.get("/employeeid", employeeID);

// Employee Promotion Routes
// Read
router.get("/read-promotioninfo", readPromotionInfo);
// Promote
router.get("/get-userpromotioninfo/:editEmployeeId", getUserPromotionInfo);
router.post("/promoteuser/:editEmployeeId", promoteUser);

// Employee Dashboard Info CRUD Routes
// Create
router.post("/add-basicinfo", addBasicInfo);
// Read
router.get("/read-basicinfo", readBasicInfo);
// Update
router.post("/edit-basicinfo", editBasicInfo);
router.get("/get-basicinfo/:editEmployeeId", getBasicInfoById);
// Delete
router.post("/delete-basicinfo", deleteBasicInfo);

// Employee Profile Route
// Read
router.get("/read-employeeprofile/:editEmployeeId", readEmployeeProfile);

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
router.post("/edit-jobinfo", editJobInfo);
router.get("/get-jobinfo/:editEmployeeId", getJobInfoById);
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
export default router;