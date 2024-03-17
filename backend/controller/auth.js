import { db } from "../database.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from 'crypto';

// Login
export const login = (req, res) => {
    const q = "SELECT * FROM tblaccount WHERE ACCOUNT_EMAIL = ?";

    db.query(q, [req.body.email], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(401).json("User not found!");

        const checkPassword = bcrypt.compareSync(
            req.body.password,
            data[0].ACCOUNT_PASSWORD
        );

        if (!checkPassword)
            return res.status(401).json("Incorrect email or password!");

        const { ACCOUNT_PASSWORD, ...userData } = data[0];

        res.status(200).json(userData);
    });
};

// Generate Token
const generateResetToken = () => {
    // Generate a random token using crypto module
    const token = crypto.randomBytes(20).toString('hex');
    return token;
};

// Reset Password Request (Send Email)
export const sendResetEmail = async (req, res) => {
    const { email } = req.body;
    const resetToken = generateResetToken(); // Generate a reset token
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // Set reset token expiry to 10 minutes from now

    try {
        // Store reset token and expiry in the database
        const insertQuery = `
            INSERT INTO tblforgotpass (EMAIL, RESET_TOKEN, RESET_TOKEN_EXPIRY)
            VALUES (?, ?, ?)
        `;
        db.query(insertQuery, [email, resetToken, resetTokenExpiry]);

        // Send reset password email with the reset token
        const transporter = nodemailer.createTransport({
            // Configure your email provider here
            service: 'Gmail', // Assuming you are using Gmail, change it if you're using a different provider
            auth: {
                user: 'careercompassbscs@gmail.com', // Your email address
                pass: 'qved wnte vpyt xiwy' // Your email password or app password if you have 2FA enabled
            }
        });

        const mailOptions = {
            from: 'careercompasbscs@gmail.com', // Sender address
            to: email, // Receiver address
            subject: 'Password Reset', // Subject line
            text: `To reset your password, click on the following link: http://localhost:5173/Login/Forgot-Password/Change-Password?token=${resetToken}` // Email body with the reset token link
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending reset password email:', error);
                res.status(500).json({ success: false, message: 'An error occurred while sending reset password email' });
            } else {
                console.log('Reset password email sent:', info.response);
                res.status(200).json({ success: true, message: 'Reset password email sent successfully' });
            }
        });
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        res.status(500).json({ success: false, message: 'An error occurred while processing the request' });
    }
};
// Reset Password Resend Email
export const resendResetEmail = async (req, res) => {
    const { email } = req.body;
    const resetToken = generateResetToken(); // Generate a new reset token
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // Set reset token expiry to 10 minutes from now

    try {
        // Update reset token and expiry in the database
        const updateQuery = `
            UPDATE tblforgotpass
            SET RESET_TOKEN = ?, RESET_TOKEN_EXPIRY = ?
            WHERE EMAIL = ?
        `;
        db.query(updateQuery, [resetToken, resetTokenExpiry, email]);

        // Send reset password email with the new reset token
        const transporter = nodemailer.createTransport({
            // Configure your email provider here
            service: 'Gmail', // Assuming you are using Gmail, change it if you're using a different provider
            auth: {
                user: 'careercompassbscs@gmail.com', // Your email address
                pass: 'qved wnte vpyt xiwy' // Your email password or app password if you have 2FA enabled
            }
        });

        const mailOptions = {
            from: 'careercompasbscs@gmail.com', // Sender address
            to: email, // Receiver address
            subject: 'Password Reset', // Subject line
            text: `To reset your password, click on the following link: http://localhost:5173/Login/Forgot-Password/Change-Password?token=${resetToken}` // Email body with the reset token link
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending reset password email:', error);
                res.status(500).json({ success: false, message: 'An error occurred while sending reset password email' });
            } else {
                console.log('Reset password email sent:', info.response);
                res.status(200).json({ success: true, message: 'Reset password email resent successfully' });
            }
        });
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        res.status(500).json({ success: false, message: "An error occurred while resending reset password email" });
    }
};
// Reset Password

// Contact Us
export const sendEmail = async (req, res) => {
    // Extract email data from request body
    const { name, email, message } = req.body;

    // Create nodemailer transporter using your SMTP details
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'careercompassbscs@gmail.com', // Replace with your email address
            pass: 'qved wnte vpyt xiwy' // Replace with your email password or app password
        }
    });

    try {
        // Send email using nodemailer
        const info = await transporter.sendMail({
            from: email, // Use the dynamically provided "from" email address
            to: 'careercompassbscs@gmail.com', // Change this to your email address
            subject: 'Contact Us Form Submission',
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        });

        // Log success message
        console.log('Email sent: ' + info.response);

        // Store user input in the database
        const query = 'INSERT INTO tblcontactus (NAME, EMAIL, MESSAGE) VALUES (?, ?, ?)';
        db.query(query, [name, email, message], (err, result) => {
            if (err) {
                console.error('Error storing data in database:', err);
                return res.status(500).json({ message: 'An error occurred while storing data in the database' });
            }
            console.log('Data stored in database:', result);
        });

        // Send response to client
        res.status(200).json({ message: 'Email sent and data stored successfully' });
    } catch (error) {
        // Log error message
        console.error('Error sending email:', error);

        // Send error response to client
        res.status(500).json({ message: 'An error occurred while sending the email' });
    }
};
// User Page
export const getUserProfile = async (req, res) => {
    const userEmail = req.query.email; // Retrieve user email from query parameters

    try {
        // Query the database to get user profile data including the image
        const query = "SELECT FIRSTNAME, IMAGE FROM tblprofile WHERE EMAIL = ?";
        db.query(query, [userEmail], (err, result) => {
            if (err) {
                console.error('Error retrieving user profile:', err);
                return res.status(500).json({ success: false, message: 'An error occurred while retrieving user profile' });
            }

            if (result.length === 0) {
                return res.status(404).json({ success: false, message: 'User profile not found' });
            }

            // Extract user data
            const { FIRSTNAME, IMAGE } = result[0];

            // Encode image data to base64 (added here)
            const encodedImage = IMAGE ? Buffer.from(IMAGE).toString('base64') : null;

            const userData = {
                firstName: FIRSTNAME,
                image: encodedImage // Assign the encoded image to the 'image' property
            };

            res.status(200).json({ success: true, userData });
        });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
};

// User Profile Page
export const getUserDetails = async (req, res) => {
    const userEmail = req.query.email;
    try {
        const profileQuery = `
      SELECT
        p.EMPLOYEE_ID,
        p.FIRSTNAME,
        p.LASTNAME,
        p.AGE,
        p.EMAIL,
        p.PHONE_NUMBER,
        p.HOME_ADDRESS,
        p.DISTRICT,
        p.CITY,
        p.PROVINCE,
        p.POSTAL_CODE,
        p.GENDER,
        p.BIRTHDAY,
        p.NATIONALITY,
        p.CIVIL_STATUS,
        p.JOB_POSITION,
        p.JOB_LEVEL,
        w.COMPANY,
        w.JOB_TITLE,
        w.COMPANY_ADDRESS,
        w.START_DATE,
        w.END_DATE,
        e.SCHOOL AS EDU_SCHOOL,
        e.YEAR_GRADUATED,
        e.GRADE_LEVEL
      FROM tblprofile AS p
      LEFT JOIN tblworkhistory AS w ON p.EMPLOYEE_ID = w.EMPLOYEE_ID
      LEFT JOIN tbleducbackground AS e ON p.EMPLOYEE_ID = e.EMPLOYEE_ID
      WHERE p.EMAIL = ?
    `;

        db.query(profileQuery, [userEmail], (err, result) => {
            if (err) {
                console.error("Error fetching user profile:", err);
                return res.status(500).json({ success: false, message: "Error fetching user profile" });
            }

            if (result.length === 0) {
                return res.status(404).json({ success: false, message: "User profile not found" });
            }

            // Initialize arrays for employment and educational history
            const employmentHistory = [];
            const educationalHistory = [];

            // Extract user profile data from the result
            const userProfile = {
                // Extract user profile data from the result
                firstName: result[0].FIRSTNAME,
                lastName: result[0].LASTNAME,
                age: result[0].AGE,
                employeeId: result[0].EMPLOYEE_ID,
                email: result[0].EMAIL,
                phoneNumber: result[0].PHONE_NUMBER,
                homeAddress: result[0].HOME_ADDRESS,
                district: result[0].DISTRICT,
                city: result[0].CITY,
                province: result[0].PROVINCE,
                postalCode: result[0].POSTAL_CODE,
                gender: result[0].GENDER,
                birthday: result[0].BIRTHDAY,
                nationality: result[0].NATIONALITY,
                civilStatus: result[0].CIVIL_STATUS,
                jobPosition: result[0].JOB_POSITION,
                jobLevel: result[0].JOB_LEVEL,
                employmentHistory,
                educationalHistory,
            };

            // Extract work history data
            result.forEach(row => {
                if (row.COMPANY && row.JOB_TITLE && row.COMPANY_ADDRESS && row.START_DATE && row.END_DATE) {
                    userProfile.employmentHistory.push({
                        company: row.COMPANY,
                        jobTitle: row.JOB_TITLE,
                        companyAddress: row.COMPANY_ADDRESS,
                        startDate: row.START_DATE,
                        endDate: row.END_DATE
                    });
                }
            });

            // Extract educational background data
            result.forEach(row => {
                if (row.EDU_SCHOOL && row.YEAR_GRADUATED && row.GRADE_LEVEL) {
                    userProfile.educationalHistory.push({
                        school: row.EDU_SCHOOL,
                        yearGraduated: row.YEAR_GRADUATED,
                        gradeLevel: row.GRADE_LEVEL
                    });
                }
            });

            res.status(200).json({ success: true, userProfile });
        });
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        res.status(500).json({ success: false, message: "An error occurred" });
    }
};
// Recommend Algorithm

// Select Jobs