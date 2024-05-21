import pg from 'pg';
import PDFDocument from 'pdfkit';
import { format } from 'date-fns';
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from 'crypto';
import jwt from 'jsonwebtoken'

// Database Connection
const pool = new pg.Pool({ // Use 'pg.Pool' instead of 'Pool'
    connectionString: "postgres://default:NpLQ8gFc1dsD@ep-aged-meadow-a1op3qk0-pooler.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require", // Get connection string from environment variable
    ssl: {
        rejectUnauthorized: false, // Use this option only if necessary
    }
});

// Tokens .......................................................................................
// Roadmap Restriction Token
const generateToken = (expiresIn) => {
    const secretKey = 'sikretongmalupetpwedengpabulong'; // Replace 'your_secret_key' with your actual secret key
    const token = jwt.sign({}, secretKey, { expiresIn });
    return token;
};
// Generate Password Reset Token
const generateResetToken = () => {
    // Generate a random token using crypto module
    const token = crypto.randomBytes(20).toString('hex');
    return token;
};

// User Side .......................................................................................
// Login
export const login = async (req, res) => {
    let client;

    try {
        client = await pool.connect();
        const result = await client.query("SELECT * FROM tblaccount WHERE account_email = $1", [req.body.email]);

        if (result.rows.length === 0) {
            return res.status(401).json("User not found!");
        }

        const { role, account_password, ...userData } = result.rows[0];

        // Check if the user has the 'Admin' role
        if (role === 'Admin') {
            return res.status(401).json("Access denied. Only employees are allowed to log in.");
        }

        if (!account_password) {
            return res.status(400).json({ error: "Password not set for this user" });
        }

        const checkPassword = bcrypt.compareSync(req.body.password, account_password);

        if (!checkPassword) {
            return res.status(401).json("Incorrect email or password!");
        }

        res.status(200).json(userData);
    } catch (error) {
        console.error(error); // Log the actual error message
        res.status(500).json({ error: error.message }); // Send the actual error message (if appropriate)
    } finally {
        if (client) {
            await client.release();
        }
    }
};

// Reset Password Request (Send Email)
export const sendResetEmail = async (req, res) => {
    const { email } = req.body;
    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    try {
        const client = await pool.connect();
        await client.query('BEGIN'); // Begin a transaction

        try {
            const insertQuery = `
                INSERT INTO tblforgotpass (email, reset_token, reset_token_expiry)
                VALUES ($1, $2, $3)
            `;
            const result = await client.query(insertQuery, [email, resetToken, resetTokenExpiry]);

            if (result.rowCount > 0) {
                console.log('Reset token inserted successfully');

                // Send reset password email
                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'careercompassbscs@gmail.com', // Your email address
                        pass: 'qved wnte vpyt xiwy' // Your email password or app password if you have 2FA enabled
                    }
                });

                const mailOptions = {
                    from: 'careercompassbscs@gmail.com',
                    to: email,
                    subject: 'Password Reset',
                    html: `
                        <p>Hello,</p>
                        <p>To reset your password, click on the following link:</p>
                        <a href="https://ccmps.vercel.app/Login/Forgot-Password/Change-Password?token=${resetToken}">Reset Password</a>
                        <p>This link will expire in 10 minutes.</p>
                        <p>If you did not request a password reset, please ignore this email.</p>
                    `
                };

                await transporter.sendMail(mailOptions);
                await client.query('COMMIT'); // Commit the transaction
                res.status(200).json({ success: true, message: 'Reset password email sent successfully' });
            } else {
                console.warn('No rows affected by the query');
                throw new Error('Failed to insert reset token');
            }
        } catch (error) {
            await client.query('ROLLBACK'); // Rollback the transaction
            console.error('Error sending reset password email:', error);
            res.status(500).json({ success: false, message: 'An error occurred while sending reset password email' });
        } finally {
            client.release();
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        res.status(500).json({ success: false, message: 'An unexpected error occurred' });
    }
};
// Reset Password Resend Email
export const resendResetEmail = async (req, res) => {
    const { email } = req.body;
    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    try {
        const client = await pool.connect();

        try {
            const updateQuery = `
                UPDATE tblforgotpass
                SET reset_token = $1, reset_token_expiry = $2
                WHERE email = $3
            `;
            const result = await client.query(updateQuery, [resetToken, resetTokenExpiry, email]);

            if (result.rowCount > 0) {
                console.log('Reset token updated successfully');

                const transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'careercompassbscs@gmail.com', // Your email address
                        pass: 'qved wnte vpyt xiwy' // Your email password or app password if you have 2FA enabled
                    }
                });

                const mailOptions = {
                    from: 'careercompassbscs@gmail.com',
                    to: email,
                    subject: 'Password Reset',
                    html: `
                        <p>Hello,</p>
                        <p>To reset your password, click on the following link:</p>
                        <a href="https://ccmps.vercel.app/Login/Forgot-Password/Change-Password?token=${resetToken}">Reset Password</a>
                        <p>This link will expire in 10 minutes.</p>
                        <p>If you did not request a password reset, please ignore this email.</p>
                    `
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
            } else {
                console.warn('No rows were updated in the database');
                throw new Error('Failed to update reset token');
            }
        } catch (error) {
            console.error('Error occurred during database operation:', error);
            res.status(500).json({ success: false, message: 'An error occurred while updating reset password token' });
        } finally {
            await client.release();
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        res.status(500).json({ success: false, message: 'An unexpected error occurred' });
    }
};
// Reset Password
export const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body; // Extract email and new password from request body

    try {
        // Check if the email exists in the database
        const user = await pool.query('SELECT * FROM tblaccount WHERE account_email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await pool.query('UPDATE tblaccount SET account_password = $1 WHERE account_email = $2', [hashedPassword, email]);

        // Respond with success message
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'An error occurred while resetting password' });
    }
};
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
        const insertQuery = `
            INSERT INTO tblcontactus (name, email, message)
            VALUES ($1, $2, $3)
        `;
        await pool.query(insertQuery, [name, email, message]);

        // Send response to client after data is stored
        res.status(200).json({ message: 'Email sent and data stored successfully' });

    } catch (error) {
        // Log error message
        console.error('Error sending email:', error);

        // Send error response to client
        res.status(500).json({ message: 'An error occurred while sending the email' });
    }
};

// Logged In User Side .......................................................................................
// User Page
export const getUserProfile = async (req, res) => {
    const userEmail = req.query.email; // Retrieve user email from query parameters

    try {
        const client = await pool.connect();

        try {
            // Prepared statement to prevent SQL injection
            const query = "SELECT firstname, image FROM tblprofile WHERE email = $1";
            const result = await client.query(query, [userEmail]);

            if (result.rowCount === 0) {
                return res.status(404).json({ success: false, message: 'User profile not found' });
            }

            // Extract user data
            const { firstname, image } = result.rows[0];

            const userData = {
                firstName: firstname,
                // Include the image data in the response
                image: image ? Buffer.from(image).toString('base64') : null
            };

            res.status(200).json({ success: true, userData });
        } catch (error) {
            console.error('Error retrieving user profile:', error);
            res.status(500).json({ success: false, message: 'An error occurred while retrieving user profile' });
        } finally {
            await client.release();
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
};
// User Profile Page
export const getUserDetails = async (req, res) => {
    const userEmail = req.query.email;

    try {
        const client = await pool.connect();

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
                    p.SKILLS,
                    p.STATUS,
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
                WHERE p.EMAIL = $1
            `;

            const result = await client.query(profileQuery, [userEmail]);

            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: "User profile not found" });
            }

            const userProfile = {
                firstName: result.rows[0].firstname,
                lastName: result.rows[0].lastname,
                age: result.rows[0].age,
                employeeId: result.rows[0].employee_id,
                email: result.rows[0].email,
                phoneNumber: result.rows[0].phone_number,
                homeAddress: result.rows[0].home_address,
                district: result.rows[0].district,
                city: result.rows[0].city,
                province: result.rows[0].province,
                postalCode: result.rows[0].postal_code,
                gender: result.rows[0].gender,
                birthday: result.rows[0].birthday,
                nationality: result.rows[0].nationality,
                civilStatus: result.rows[0].civil_status,
                jobPosition: result.rows[0].job_position,
                jobLevel: result.rows[0].job_level,
                skills: result.rows[0].skills,
                status: result.rows[0].status,
                employmentHistory: [],
                educationalHistory: [],
            };

            // Extract work history and educational background data
            result.rows.forEach(row => {
                if (row.company && row.job_title && row.company_address && row.start_date && row.end_date) {
                    userProfile.employmentHistory.push({
                        company: row.company,
                        jobTitle: row.job_title,
                        companyAddress: row.company_address,
                        startDate: row.start_date,
                        endDate: row.end_date
                    });
                }

                if (row.edu_school && row.year_graduated && row.grade_level) {
                    userProfile.educationalHistory.push({
                        school: row.edu_school,
                        yearGraduated: row.year_graduated,
                        gradeLevel: row.grade_level
                    });
                }
            });

            res.status(200).json({ success: true, userProfile });
        } catch (error) {
            console.error("Error fetching user profile:", error);
            res.status(500).json({ success: false, message: "Error fetching user profile" });
        } finally {
            await client.release();
        }
    } catch (error) {
        console.error("An unexpected error occurred:", error);
        res.status(500).json({ success: false, message: "An error occurred" });
    }
};
// Fetch user job
export const getUserJob = async (req, res) => {
    try {
        const userEmail = req.query.email; // Retrieve user's email from query parameter

        // Query to fetch user's selected job from the database
        const query = `
            SELECT job_selected
            FROM tblprofile
            WHERE email = $1
        `;

        // Execute the query with user's email as parameter
        const result = await pool.query(query, [userEmail]);

        // Check if a job is selected for the user
        if (result.rows.length > 0 && result.rows[0].job_selected) {
            // User has already selected a job
            const jobTitle = result.rows[0].job_selected;
            res.status(200).json({ jobSelected: true, jobTitle: jobTitle }); // Include job title in the response
        } else {
            // User has not selected a job yet
            res.status(200).json({ jobSelected: false, jobTitle: null }); // Return null for job title
        }
    } catch (error) {
        console.error("Error fetching user job:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
// Save Selected Job to the Database
export const saveJob = async (req, res) => {
    try {
        const userEmail = req.query.email;
        const selectedJobTitle = req.query.job;

        // Check if the user exists
        const userExistsQuery = 'SELECT * FROM tblprofile WHERE email = $1';
        const userExistsResult = await pool.query(userExistsQuery, [userEmail]);

        if (userExistsResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update job selection for the user
        const updateJobQuery = 'UPDATE tblprofile SET job_selected = $1 WHERE email = $2';
        await pool.query(updateJobQuery, [selectedJobTitle, userEmail]);

        return res.status(200).json({ message: 'Job selection saved successfully' });
    } catch (error) {
        console.error('Error saving job selection:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
// Max Phase Number
export const maxPhaseNumber = async (req, res) => {
    try {
        const selectedJobTitle = req.query.job; // Get the job position from query parameters
        const client = await pool.connect();

        // Modify the query to fetch the maximum phase number based on the job position
        const result = await client.query('SELECT MAX(phase) AS max_phase FROM (SELECT phase FROM tblvideo WHERE position = $1 UNION SELECT phase FROM tblassessment WHERE position = $1) AS combined_tables', [selectedJobTitle]);

        const maxPhaseNumber = result.rows[0].max_phase;
        client.release();
        res.json({ maxPhaseNumber });
    } catch (error) {
        console.error('Error fetching max phase number:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Roadmap (Video and Assesment [consist of Question and Answer])
// Video
export const getAssessment = async (req, res) => {
    try {
        // Retrieve the job title and phase from the query parameters
        const selectedJobTitle = req.query.job;
        const phase = parseInt(req.query.phase);

        if (!selectedJobTitle || !phase) {
            return res.status(400).json({ error: 'No job title or phase provided' });
        }

        // Query the database for the video URL based on the job title and phase
        const client = await pool.connect();
        const result = await client.query('SELECT video FROM tblvideo WHERE position = $1 AND phase = $2', [selectedJobTitle, phase]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Video not found for the selected job and phase' });
        }

        const videoUrl = result.rows[0].video;
        res.json({ videoUrl });
    } catch (error) {
        console.error('Error fetching video URL:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Question
export const getQuestions = async (req, res) => {
    try {
        // Retrieve the job title from the query parameters
        const selectedJobTitle = req.query.job;

        if (!selectedJobTitle) {
            return res.status(400).json({ error: 'No job title provided' });
        }

        // Query the database for the assessment questions based on the job title
        const client = await pool.connect();
        const result = await client.query('SELECT description, question_number, a, b, c, d, correct_choice FROM tblassessment WHERE position = $1', [selectedJobTitle]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Assessment questions not found for the selected job' });
        }

        // Handle potential missing data in a database row
        const questions = result.rows.map(question => {
            return {
                description: question.description,
                question_number: question.question_number,
                options: {
                    a: question.a || '', // Set a default value (empty string) if 'a' is missing
                    b: question.b || '',
                    c: question.c || '',
                    d: question.d || '',
                },
                correct_choice: question.correct_choice
            };
        });

        res.json({ questions });
    } catch (error) {
        console.error('Error fetching assessment questions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Related Courses
export const getCourse = async (req, res) => {
    try {
        // Retrieve the job title from the query parameters
        const selectedJobTitle = req.query.job;

        if (!selectedJobTitle) {
            return res.status(400).json({ error: 'No job title provided' });
        }

        // Query the database for courses based on the job title
        const client = await pool.connect();
        const result = await client.query('SELECT description, link FROM tblcourse WHERE position = $1', [selectedJobTitle]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Courses not found for the selected job title' });
        }

        const courses = result.rows;
        res.json({ courses });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Retry Count Update
export const retryCount = async (req, res) => {
    try {
        // Retrieve user email and job position from query parameters
        const userEmail = req.query.email;
        const selectedJobTitle = req.query.job;

        // Check if user email and job position are provided
        if (!userEmail || !selectedJobTitle) {
            return res.status(400).json({ success: false, message: "User email and job position are required." });
        }

        // Update retry count for the user with the specified email and job position
        let updateQuery;
        let updateValues;

        // Check if retries are null, then set to 1, else increment by 1
        const checkQuery = `
            SELECT retries
            FROM tblprofile
            WHERE email = $1 AND job_selected = $2
        `;
        const checkValues = [userEmail, selectedJobTitle];

        const checkResult = await pool.query(checkQuery, checkValues);

        if (checkResult.rows.length > 0) {
            const retries = checkResult.rows[0].retries;
            if (retries === null) {
                updateQuery = `
                    UPDATE tblprofile 
                    SET retries = 1 
                    WHERE email = $1 AND job_selected = $2
                    RETURNING *
                `;
                updateValues = [userEmail, selectedJobTitle];
            } else {
                updateQuery = `
                    UPDATE tblprofile 
                    SET retries = retries + 1 
                    WHERE email = $1 AND job_selected = $2
                    RETURNING *
                `;
                updateValues = [userEmail, selectedJobTitle];
            }
        } else {
            return res.status(404).json({ success: false, message: "User not found or job position not matched." });
        }

        const result = await pool.query(updateQuery, updateValues);

        // Check if the update was successful
        if (result.rowCount > 0) {
            return res.status(200).json({ success: true, message: "Retry count updated successfully." });
        } else {
            return res.status(404).json({ success: false, message: "User not found or job position not matched." });
        }
    } catch (error) {
        console.error("Error updating retry count:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};
// Store Answer
export const storeAnswer = async (req, res) => {
    try {
        // Extract necessary data from the request
        const { email, position, question, answer, result } = req.body;

        // Prepare the SQL query
        const query = `
            INSERT INTO tblappraisal (email, position, question, answer, result)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const values = [email, position, question, answer, result];

        // Execute the SQL query
        await pool.query(query, values);

        // Send response
        res.status(200).json({ success: true, message: "Answer stored successfully" });
    } catch (error) {
        console.error("Error storing answer:", error);
        res.status(500).json({ success: false, message: "Error storing answer" });
    }
};
// Calculate and Delete Answers (If Did Not Pass)
export const answerResult = async (req, res) => {
    try {
        // Retrieve user email and job position from query parameters
        const userEmail = req.query.email;
        const selectedJobTitle = req.query.job;

        // Check if user email and job position are provided
        if (!userEmail || !selectedJobTitle) {
            return res.status(400).json({ success: false, message: "User email and job position are required." });
        }

        // Fetch the total count of assessments answered by the user for the selected job position
        const totalCountQuery = `
            SELECT COUNT(*) AS total_count
            FROM tblappraisal
            WHERE email = $1 AND position = $2
        `;
        const totalCountValues = [userEmail, selectedJobTitle];
        const totalCountResult = await pool.query(totalCountQuery, totalCountValues);
        const totalCount = totalCountResult.rows[0].total_count;

        // Fetch the count of correct answers for the user for the selected job position
        const correctCountQuery = `
            SELECT COUNT(*) AS correct_count
            FROM tblappraisal
            WHERE email = $1 AND position = $2 AND result = 'correct'
        `;
        const correctCountValues = [userEmail, selectedJobTitle];
        const correctCountResult = await pool.query(correctCountQuery, correctCountValues);
        const correctCount = correctCountResult.rows[0].correct_count;

        // Fetch the count of incorrect answers for the user for the selected job position
        const incorrectCount = totalCount - correctCount;

        // Calculate the percentage of correct answers
        const percentage = (correctCount / totalCount) * 100;

        // Round off the percentage to the nearest hundredth
        const roundedPercentage = Math.round(percentage * 100) / 100;

        // Determine if the user passed or failed
        const result = percentage >= 80 ? 'Passed' : 'Failed';

        return res.status(200).json({
            success: true,
            totalQuestions: totalCount,
            totalCorrectPercentage: roundedPercentage,
            totalIncorrectPercentage: 100 - roundedPercentage,
            result: result
        });
    } catch (error) {
        console.error("Error fetching answer result:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};
// Retry Roadmap Assessment
export const retryAssessment = async (req, res) => {
    try {
        // Retrieve user email and job position from query parameters
        const userEmail = req.query.email;
        const selectedJobTitle = req.query.job;

        // Check if user email and job position are provided
        if (!userEmail || !selectedJobTitle) {
            return res.status(400).json({ success: false, message: "User email and job position are required." });
        }

        // Delete assessment data for the user for the selected job position
        const deleteQuery = `
            DELETE FROM tblappraisal
            WHERE email = $1 AND position = $2
        `;
        const deleteValues = [userEmail, selectedJobTitle];
        await pool.query(deleteQuery, deleteValues);

        // Update current_phase column on tblprofile to 1 for the user
        const updateQuery = `
            UPDATE tblprofile
            SET current_phase = 1
            WHERE email = $1
        `;
        const updateValues = [userEmail];
        await pool.query(updateQuery, updateValues);

        return res.status(200).json({ success: true, message: "Assessment data deleted and current phase updated successfully." });
    } catch (error) {
        console.error("Error retrying assessment:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};
// Proceed Assessment
export const proceedAssessment = async (req, res) => {
    try {
        const userEmail = req.query.email;
        const selectedJobTitle = req.query.job;

        // Check if email and job title are provided
        if (!userEmail || !selectedJobTitle) {
            return res.status(400).json({ success: false, message: "User email and job position are required." });
        }

        // Update the score percentage of the total correct answer percentage in tblprofile
        const updateScoreQuery = `
        UPDATE tblprofile
        SET score = $1
        WHERE email = $2 AND job_selected = $3
      `;
        const scorePercentage = req.body.scorePercentage; // Assuming the score percentage is provided in the request body
        const updateScoreValues = [scorePercentage, userEmail, selectedJobTitle];
        await pool.query(updateScoreQuery, updateScoreValues);

        return res.status(200).json({ success: true, message: "Score percentage updated successfully." });
    } catch (error) {
        console.error("Error updating score percentage:", error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};
// Check if the Score is Stored
export const checkScore = async (req, res) => {
    try {
        const userEmail = req.query.email;

        const query = `
            SELECT score, restriction_token
            FROM tblprofile
            WHERE email = $1
        `;
        const values = [userEmail];

        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            const { score, restriction_token } = result.rows[0];

            if (restriction_token) {
                const decodedToken = jwt.decode(restriction_token);

                if (decodedToken && decodedToken.exp) {
                    const expirationDate = new Date(decodedToken.exp * 1000);
                    const currentDate = new Date();
                    const remainingDays = Math.ceil((expirationDate - currentDate) / (1000 * 60 * 60 * 24));

                    res.json({ success: true, message: "There is a Data inside", score, remainingDays });
                    return;
                }
            }

            // If restriction_token is missing/invalid
            res.json({ success: true, message: "There is a Data inside", score, remainingDays: null });
        } else {
            // No rows found for the given email and job title
            res.json({ success: true, message: "No data inputted", score: null, remainingDays: null });
        }
    } catch (error) {
        console.error('Error checking score:', error);
        res.status(500).json({ success: false, message: 'Error checking score' });
    }
};
// Save Phase Number
export const savePhaseNumber = async (req, res) => {
    try {
        const { email, phase } = req.query;
        const client = await pool.connect();
        const query = `
            UPDATE tblprofile
            SET current_phase = $1
            WHERE email = $2
        `;
        const values = [phase, email];
        await client.query(query, values);
        client.release();
        res.status(200).json({ message: "Phase number saved successfully." });
    } catch (error) {
        console.error("Error saving phase number:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
// Retrieve Phase Number
export const getPhaseNumber = async (req, res) => {
    try {
        const { email } = req.query;
        const client = await pool.connect();
        const query = `
            SELECT current_phase
            FROM tblprofile
            WHERE email = $1
        `;
        const values = [email];
        const result = await client.query(query, values);
        client.release();
        if (result.rows.length > 0) {
            const phaseNumber = result.rows[0].current_phase;
            res.status(200).json({ phaseNumber });
        } else {
            res.status(404).json({ message: "User not found." });
        }
    } catch (error) {
        console.error("Error retrieving phase number:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
// Select Jobs

// Admin Side .......................................................................................
// Admin Login
export const adminLogin = async (req, res) => {
    let client;

    try {
        client = await pool.connect();
        const result = await client.query("SELECT * FROM tblaccount WHERE account_email = $1", [req.body.email]);

        if (result.rows.length === 0) {
            return res.status(401).json("User not found!");
        }

        const user = result.rows[0];

        // Check if the user's role is one of the HR roles
        if (!['HR Coordinator', 'HR Manager'].includes(user.role)) {
            return res.status(403).json("You are not authorized to login as an HR user!");
        }

        const hashedPassword = user.account_password;

        if (!hashedPassword) {
            return res.status(400).json("Password not set for this user!");
        }

        const isPasswordValid = bcrypt.compareSync(req.body.password, hashedPassword);

        if (!isPasswordValid) {
            return res.status(401).json("Incorrect email or password!");
        }

        // If password is valid, return user with role
        res.status(200).json({ ...user, role: user.role });
    } catch (error) {
        console.error(error); // Log the actual error message
        res.status(500).json({ error: "Internal server error" }); // Send a generic error message
    } finally {
        if (client) {
            await client.release();
        }
    }
};
// Fetch Admin Profile
export const getAdminProfile = async (req, res) => {
    const userEmail = req.query.email; // Retrieve user email from query parameters

    try {
        const client = await pool.connect();

        try {
            // Prepared statement to prevent SQL injection
            const query = `
                SELECT 
                    tp.firstname,
                    ta.role,
                    tp.image 
                FROM 
                    tblprofile tp 
                    INNER JOIN tblaccount ta ON tp.email = ta.account_email
                WHERE 
                    tp.email = $1`;
            const result = await client.query(query, [userEmail]);

            if (result.rowCount === 0) {
                return res.status(404).json({ success: false, message: 'User profile not found' });
            }

            // Extract user data
            const { firstname, role, image } = result.rows[0];

            const userData = {
                firstName: firstname,
                role: role,
                // Include the image data in the response
                image: image ? Buffer.from(image).toString('base64') : null
            };

            res.status(200).json({ success: true, userData });
        } catch (error) {
            console.error('Error retrieving user profile:', error);
            res.status(500).json({ success: false, message: 'An error occurred while retrieving user profile' });
        } finally {
            await client.release();
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        res.status(500).json({ success: false, message: 'An error occurred' });
    }
};
// Auto Employee Number
export const employeeID = async (req, res) => { // Auto Employee ID
    try {
        const client = await pool.connect(); // Connect to the database

        // Fetch the maximum Employee ID from the database
        const result = await client.query('SELECT MAX(employee_id) AS max_id FROM tblprofile');

        // Get the maximum Employee ID or default to 0 if no records exist
        const maxId = result.rows[0].max_id || 0;

        // Calculate the next available Employee ID
        const nextId = maxId + 1;

        // Release the database client
        client.release();

        // Send the next available Employee ID as a response
        res.status(200).json({ employeeId: nextId });
    } catch (error) {
        console.error('Error fetching next employee ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Admin Dasboard ***********************************************
// (Sub Data Below)
// Get total number of users
const getTotalUsers = async () => {
    const query = "SELECT COUNT(*) FROM tblaccount";
    const { rows } = await pool.query(query);
    return rows[0].count;
};
// Get total number of departments
const getTotalDepartments = async () => {
    const query = "SELECT COUNT(*) FROM tbldepartment";
    const { rows } = await pool.query(query);
    return rows[0].count;
};
// Get total number of jobs
const getTotalJobs = async () => {
    const query = "SELECT COUNT(*) FROM tblroles";
    const { rows } = await pool.query(query);
    return rows[0].count;
};
// Get total number of roadmaps
const getTotalRoadmaps = async () => {
    const query = "SELECT COUNT(*) FROM tblprofile WHERE job_selected IS NOT NULL";
    const { rows } = await pool.query(query);
    return rows[0].count;
};
// # of Total Users, Departments, Jobs and Roadmap
export const totalNumberBanner = async (req, res) => {
    try {
        const totalUsers = await getTotalUsers();
        const totalDepartments = await getTotalDepartments();
        const totalJobs = await getTotalJobs();
        const totalRoadmaps = await getTotalRoadmaps();

        res.json({
            totalUsers,
            totalDepartments,
            totalJobs,
            totalRoadmaps
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
// Chart (Jobs Per Department and Employee vs Admin)
export const chartDashboard = async (req, res) => {
    try {
        // Fetch total number of jobs per department
        const jobsPerDepartmentQuery = `
            SELECT d.department, COUNT(r.position) AS total_jobs
            FROM tblroles r
            INNER JOIN tbldepartment d ON r.dept_id = d.dept_id
            GROUP BY d.department;
        `;
        const jobsPerDepartmentResult = await pool.query(jobsPerDepartmentQuery);

        // Fetch total number of employees vs admins
        const employeesVsAdminsQuery = `
            SELECT
                CASE
                    WHEN role IN ('Employee') THEN 'Employee'
                    WHEN role IN ('HR Coordinator', 'HR Manager') THEN 'Admin'
                END AS role_type,
                COUNT(*) AS total_count
            FROM tblaccount
            GROUP BY role_type;
        `;
        const employeesVsAdminsResult = await pool.query(employeesVsAdminsQuery);

        res.json({
            jobsPerDepartment: jobsPerDepartmentResult.rows,
            employeesVsAdmins: employeesVsAdminsResult.rows
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Employee Dashboard Info CRUD ***********************************************
// Create/Add
export const addBasicInfo = async (req, res) => {
    try {
        const {
            image,
            firstName,
            lastName,
            email,
            phoneNumber,
            gender,
            birthday,
            role,
            accountPasswordPlain,
            jobPosition
        } = req.body;

        // Calculate age based on the provided birthday
        const dob = new Date(birthday);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        const isBirthdayPassed = today.getMonth() > dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
        const finalAge = isBirthdayPassed ? age : age - 1;

        // Connect to the database
        const client = await pool.connect();

        // Fetch the next available Employee ID
        const employeeIdResult = await client.query('SELECT MAX(employee_id) AS max_id FROM tblprofile');
        const maxId = employeeIdResult.rows[0].max_id || 0;
        const nextId = maxId + 1;

        // Encode image data (base64 to bytea)
        const encodedImage = Buffer.from(image, 'base64');

        // Insert employee data with the fetched employee ID
        await client.query(`
        INSERT INTO tblprofile (
            employee_id,
            image,
            firstname,
            lastname,
            email,
            age,
            phone_number,
            gender,
            birthday,
            job_position
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        )
        `, [
            nextId,
            encodedImage,
            firstName,
            lastName,
            email,
            finalAge,
            phoneNumber,
            gender,
            birthday,
            jobPosition
        ]);

        // Generate a salt for password hashing
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash the plain password
        const hashedPassword = await bcrypt.hash(accountPasswordPlain, salt);

        // Insert data into tblaccount
        await client.query(`
            INSERT INTO tblaccount (
                employee_id,
                firstname,
                lastname,
                account_email,
                account_password,
                account_password_plain,
                role
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7
            )
        `, [
            nextId,
            firstName,
            lastName,
            email, // Use the email from tblprofile
            hashedPassword,
            accountPasswordPlain,
            role
        ]);

        // Release the database client
        client.release();

        // Send success response
        res.status(201).json({ message: 'Employee added successfully', employeeId: nextId });
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Read
export const readBasicInfo = async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`
            SELECT 
                employee_id, 
                image, 
                firstname, 
                lastname, 
                age, 
                email, 
                phone_number, 
                home_address, 
                district, 
                city, 
                province, 
                postal_code, 
                gender, 
                birthday, 
                nationality, 
                civil_status,
                job_position 
            FROM tblprofile
        `);
        const employees = result.rows;
        client.release();
        res.status(200).json(employees);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
    }
};
// Update
export const editBasicInfo = async (req, res) => {
    try {
        const { employee_id, image, firstName, lastName, email, phoneNumber, role } = req.body;
        const encodedImage = Buffer.from(image, 'base64');

        // Update the employee information in the tblprofile table
        const profileQuery = `
            UPDATE tblprofile 
            SET 
                image = $1,
                firstname = $2,
                lastname = $3,
                email = $4,
                phone_number = $5
            WHERE employee_id = $6
        `;
        const profileValues = [encodedImage, firstName, lastName, email, phoneNumber, employee_id];
        await pool.query(profileQuery, profileValues);

        // Update the employee information in the tblaccount table
        const accountQuery = `
            UPDATE tblaccount 
            SET 
                firstname = $1,
                lastname = $2,
                account_email = $3,
                role = $4
            WHERE employee_id = $5
        `;
        const accountValues = [firstName, lastName, email, role, employee_id];
        await pool.query(accountQuery, accountValues);

        res.status(200).json({ message: "Employee information updated successfully." });
    } catch (error) {
        console.error("Error updating employee information:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
// Autofill Edit Panel
export const getBasicInfoById = async (req, res) => {
    try {
        const employeeId = req.params.editEmployeeId; // Assuming the employee ID is sent as a route parameter
        // Construct the SQL query to select employee data based on employee ID
        const query = {
            text: `SELECT 
                        p.employee_id, 
                        p.image, 
                        p.firstname, 
                        p.lastname, 
                        p.email, 
                        p.phone_number, 
                        p.birthday, 
                        p.job_position,
                        a.account_email,
                        a.role
                    FROM tblprofile p
                    JOIN tblaccount a ON p.employee_id = a.employee_id
                    WHERE p.employee_id = $1`,
            values: [employeeId],
        };
        // Execute the SQL query
        const result = await pool.query(query);
        // Check if any row was found
        if (result.rows.length > 0) {
            const employeeData = result.rows[0];
            // Send the employee data as JSON response
            res.status(200).json(employeeData);
        } else {
            // If no employee with the specified ID is found, send a 404 error
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        console.error('Error fetching employee data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Delete
export const deleteBasicInfo = async (req, res) => {
    const employeeId = req.params.editEmployeeId; // Retrieve employee ID from URL parameters

    if (!employeeId) {
        return res.status(400).json({ error: 'Employee ID not provided in the URL parameters' });
    }

    try {
        // Construct the SQL queries to delete rows with the specified employee ID
        const queryProfile = {
            text: 'DELETE FROM tblprofile WHERE employee_id = $1',
            values: [employeeId],
        };

        const queryAccount = {
            text: 'DELETE FROM tblaccount WHERE employee_id = $1',
            values: [employeeId],
        };

        const queryEducation = {
            text: 'DELETE FROM tbleducbackground WHERE employee_id = $1',
            values: [employeeId],
        };

        const queryWorkHistory = {
            text: 'DELETE FROM tblworkhistory WHERE employee_id = $1',
            values: [employeeId],
        };

        // Execute the SQL queries
        const resultProfile = await pool.query(queryProfile);
        const resultAccount = await pool.query(queryAccount);
        const resultEducation = await pool.query(queryEducation);
        const resultWorkHistory = await pool.query(queryWorkHistory);

        // Check if any row was affected in tblprofile
        if (resultProfile.rowCount > 0) {
            // Check if any row was affected in tblaccount
            if (resultAccount.rowCount > 0) {
                // Check if any row was affected in tbleducbackground
                if (resultEducation.rowCount > 0 || resultWorkHistory.rowCount > 0) {
                    res.status(200).json({ message: 'Employee, associated account, education, and work history deleted successfully' });
                } else {
                    res.status(200).json({ message: 'Employee and associated account deleted successfully, but education and work history not found' });
                }
            } else {
                res.status(200).json({ message: 'Employee deleted successfully, but associated account not found' });
            }
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Employee Profile ***********************************************
// Read
export const readEmployeeProfile = async (req, res) => {
    try {
        const employeeId = req.params.editEmployeeId;

        if (!employeeId) {
            return res.status(400).json({ error: 'Invalid employeeId' });
        }

        // Start a client session
        const client = await pool.connect();

        // Execute separate queries for tblprofile, tbleducbackground, and tblworkhistory
        const profileQuery = 'SELECT * FROM tblprofile WHERE employee_id = $1';
        const educBackgroundQuery = 'SELECT * FROM tbleducbackground WHERE employee_id = $1';
        const workHistoryQuery = 'SELECT * FROM tblworkhistory WHERE employee_id = $1';

        const profileResult = await client.query(profileQuery, [employeeId]);
        const educBackgroundResult = await client.query(educBackgroundQuery, [employeeId]);
        const workHistoryResult = await client.query(workHistoryQuery, [employeeId]);

        // Release the client session
        client.release();

        // Combine the results and send the response with the fetched data
        const responseData = {
            profile: profileResult.rows[0],
            educBackground: educBackgroundResult.rows,
            workHistory: workHistoryResult.rows
        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error fetching employee profile:', error); // Log the error for debugging
        res.status(500).json({ error: error.message }); // Send the actual error message to the client
    }
}
// Edit Basic Info
export const editProfileBasicInfo = async (req, res) => {
    try {
        const { employee_id, image, firstName, lastName, email, phoneNumber, birthday, homeAddress, district, city, province, postalCode, gender, jobPosition } = req.body;
        const encodedImage = Buffer.from(image, 'base64');

        // Update the employee information in the tblprofile table
        const profileQuery = `
            UPDATE tblprofile 
            SET 
                image = $1,
                firstname = $2,
                lastname = $3,
                email = $4,
                phone_number = $5,
                birthday = $6,
                home_address = $7,
                district = $8,
                city = $9,
                province = $10,
                postal_code = $11,
                gender = $12,
                job_position = $13
            WHERE employee_id = $14
        `;
        const profileValues = [encodedImage, firstName, lastName, email, phoneNumber, birthday, homeAddress, district, city, province, postalCode, gender, jobPosition, employee_id];
        await pool.query(profileQuery, profileValues);

        // Update the account_email in tblaccount table based on the email in tblprofile
        const accountQuery = `
            UPDATE tblaccount 
            SET 
                account_email = $1
            WHERE employee_id = $2
        `;
        const accountValues = [email, employee_id];
        await pool.query(accountQuery, accountValues);

        res.status(200).json({ message: "Employee information updated successfully." });
    } catch (error) {
        console.error("Error updating employee information:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
// Edit Basic Info Autofill
export const getProfileBasicInfoById = async (req, res) => {
    try {
        const employeeId = req.params.editEmployeeId; // Assuming the employee ID is sent as a route parameter
        // Construct the SQL query to select employee data based on employee ID
        const query = {
            text: `SELECT 
                        p.employee_id, 
                        p.image, 
                        p.firstname, 
                        p.lastname, 
                        p.email, 
                        p.phone_number, 
                        p.birthday, 
                        p.home_address, 
                        p.district, 
                        p.city, 
                        p.province, 
                        p.postal_code, 
                        p.gender,
                        p.job_position,
                        a.account_email
                    FROM tblprofile p
                    JOIN tblaccount a ON p.employee_id = a.employee_id
                    WHERE p.employee_id = $1`,
            values: [employeeId],
        };
        // Execute the SQL query
        const result = await pool.query(query);
        // Check if any row was found
        if (result.rows.length > 0) {
            const employeeData = result.rows[0];
            // Send the employee data as JSON response
            res.status(200).json(employeeData);
        } else {
            // If no employee with the specified ID is found, send a 404 error
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        console.error('Error fetching employee data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Edit Personal Info
export const editProfilePersonalInfo = async (req, res) => {
    try {
        const { employee_id, nationality, civilStatus, skills } = req.body;

        // Update the employee information in the tblprofile table
        const profileQuery = `
            UPDATE tblprofile 
            SET 
                nationality = $1,
                civil_status = $2,
                skills = $3
            WHERE employee_id = $4
        `;
        const profileValues = [nationality, civilStatus, skills, employee_id];
        await pool.query(profileQuery, profileValues);

        res.status(200).json({ message: "Employee information updated successfully." });
    } catch (error) {
        console.error("Error updating employee information:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
// Edit Personal Info Autofill
export const getProfilePersonalInfoById = async (req, res) => {
    try {
        const employeeId = req.params.editEmployeeId; // Assuming the employee ID is sent as a route parameter
        // Construct the SQL query to select employee data based on employee ID
        const query = {
            text: `SELECT 
                        p.employee_id, 
                        p.nationality, 
                        p.civil_status, 
                        p.skills
                    FROM tblprofile p
                    WHERE p.employee_id = $1`,
            values: [employeeId],
        };
        // Execute the SQL query
        const result = await pool.query(query);
        // Check if any row was found
        if (result.rows.length > 0) {
            const employeeData = result.rows[0];
            // Send the employee data as JSON response
            res.status(200).json(employeeData);
        } else {
            // If no employee with the specified ID is found, send a 404 error
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        console.error('Error fetching employee data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Employee Appraisal ***********************************************
// Read Employee with Pending Appraisal
export const readAppraisalBasicInfo = async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`
            SELECT 
                employee_id, 
                image, 
                firstname, 
                lastname, 
                age, 
                email, 
                phone_number, 
                home_address, 
                district, 
                city, 
                province, 
                postal_code, 
                gender, 
                birthday, 
                nationality, 
                civil_status,
                job_position,
                job_selected,
                score
            FROM tblprofile
            WHERE score IS NOT NULL
        `);
        const employees = result.rows;
        client.release();
        res.status(200).json(employees);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
    }
};
// Read Employee Details for Appraisal
export const readAppraisalBackgroundInfo = async (req, res) => {
    const userEmail = req.query.email;
    const selectedJobTitle = req.query.job;

    try {
        const client = await pool.connect();
        const result = await client.query(`
            SELECT 
                image,
                firstname, 
                lastname, 
                employee_id, 
                job_position, 
                job_level, 
                job_selected, 
                score, 
                retries
            FROM tblprofile
            WHERE email = $1 AND job_selected = $2
        `, [userEmail, selectedJobTitle]);
        const employeeDetails = result.rows;
        client.release();
        res.status(200).json(employeeDetails);
    } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Internal Server Error');
    }
};
// Appraisal Formula
export const appraisalCalculate = async (req, res) => {
    try {
        const userEmail = req.query.email;
        const selectedJobTitle = req.query.job;

        // Fetch user profile data from tblprofile
        const profileQuery = `
            SELECT email, score, retries, job_selected
            FROM tblprofile
            WHERE email = $1 AND job_selected = $2
        `;
        const profileResult = await pool.query(profileQuery, [userEmail, selectedJobTitle]);

        if (profileResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User profile not found" });
        }

        const { email, score, retries } = profileResult.rows[0];

        // Calculate the appraisal score
        let appraisalScore = score * 0.6 + (80 - retries * 5) * 0.4;
        appraisalScore = Number(appraisalScore.toFixed(3)); // Round to three decimal places

        // Determine the outcome
        let outcome;
        if (appraisalScore > 90) {
            outcome = "Promotion";
        } else if (appraisalScore >= 89 && appraisalScore <= 90) {
            outcome = "30% Salary Increase";
        } else if (appraisalScore >= 88 && appraisalScore < 89) {
            outcome = "25% Salary Increase";
        } else if (appraisalScore >= 87 && appraisalScore < 88) {
            outcome = "20% Salary Increase";
        } else if (appraisalScore >= 85 && appraisalScore < 87) {
            outcome = "15% Salary Increase";
        } else if (appraisalScore >= 83 && appraisalScore < 85) {
            outcome = "10% Salary Increase";
        } else if (appraisalScore >= 81 && appraisalScore < 83) {
            outcome = "5% Salary Increase";
        } else {
            outcome = "No Change";
        }

        // Update the user profile with the appraisal result
        const updateQuery = `
            UPDATE tblprofile
            SET result = $1
            WHERE email = $2 AND job_selected = $3
        `;
        await pool.query(updateQuery, [outcome, email, selectedJobTitle]);

        // Respond with the result
        res.json({
            success: true,
            appraisalScore,
            outcome
        });

    } catch (error) {
        console.error('Error calculating appraisal:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
// Print Appraisal to PDF
export const printAppraisal = async (req, res) => {
    try {
        const userEmail = req.query.email;
        const selectedJobTitle = req.query.job;

        // Fetch user profile data from tblprofile
        const profileQuery = `
            SELECT firstname, lastname, employee_id, job_selected, score, result
            FROM tblprofile
            WHERE email = $1 AND job_selected = $2
        `;
        const profileResult = await pool.query(profileQuery, [userEmail, selectedJobTitle]);

        if (profileResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User profile not found" });
        }

        const { firstname, lastname, employee_id, job_selected, score, result } = profileResult.rows[0];
        const companyAddress = "Congressional Rd Ext, Barangay 171, Caloocan, Metro Manila";

        // Fetch HR details from tblaccount based on email in session storage
        const hrEmail = req.query.hrEmail;
        const hrQuery = `
            SELECT firstname, lastname, role
            FROM tblaccount
            WHERE account_email = $1
        `;
        const hrResult = await pool.query(hrQuery, [hrEmail]);

        if (hrResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "HR details not found" });
        }

        const { firstname: hrFirstname, lastname: hrLastname, role: hrRole } = hrResult.rows[0];
        const appraisalDate = format(new Date(), 'MMMM dd, yyyy');

        // Generate token with 3-month expiration
        const token = generateToken('90d');

        // Update tblprofile with the generated token
        const updateTokenQuery = `
            UPDATE tblprofile
            SET
                job_selected = NULL,
                current_phase = NULL,
                retries = NULL,
                score = NULL,
                result = NULL,
                restriction_token = $1
            WHERE email = $2 AND job_selected = $3
        `;
        await pool.query(updateTokenQuery, [token, userEmail, selectedJobTitle]);

        // Delete data from tblappraisal based on email and position
        const deleteAppraisalQuery = `
            DELETE FROM tblappraisal
            WHERE email = $1 AND position = $2
        `;
        await pool.query(deleteAppraisalQuery, [userEmail, selectedJobTitle]);

        // Create a PDF document
        const doc = new PDFDocument({ size: 'letter' });

        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            res
                .writeHead(200, {
                    'Content-Length': Buffer.byteLength(pdfData),
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=appraisal_letter.pdf',
                })
                .end(pdfData);
        });

        // Header
        doc.image('../frontend/src/assets/appraisal/logo.png', 50, 45, { width: 100 });
        doc.moveDown();
        doc.fontSize(12).text(companyAddress, 50, 65, { align: 'left' });
        doc.text(appraisalDate, 50, 80, { align: 'left' });

        doc.moveDown(2);

        // Title
        doc.fontSize(16).text('Appraisal Letter – CONFIDENTIAL', { align: 'center', underline: true });
        doc.moveDown();

        // Employee details
        doc.fontSize(12).text(`Dear ${firstname} ${lastname},`);
        doc.moveDown();
        doc.text(`Employee ID: ${employee_id}`);
        doc.moveDown();

        // Appraisal message
        doc.text(`Congratulations on successfully completing your career roadmap.`);
        doc.moveDown();
        doc.text(`Your dedication and commitment have been exemplary, and we are pleased to inform you that based on your performance, you have achieved an appraisal score of ${score}%.`);
        doc.moveDown();
        doc.text(`As a result of your outstanding performance, we are delighted to offer you the ${result}. This change will be effective by the end of the month.`);
        doc.moveDown();
        doc.text(`Your contributions to our team have been invaluable, and we look forward to your continued success.`);
        doc.moveDown();

        // Signature
        doc.image('../frontend/src/assets/appraisal/signature.png', 50, doc.y, { width: 100 });

        // Closing and HR details
        doc.text('Best regards,');
        doc.moveDown();
        doc.text(`${hrFirstname} ${hrLastname}`);
        doc.text(`${hrRole}`);

        // Finalize the PDF and end the stream
        doc.end();


    } catch (error) {
        console.error('Error generating appraisal letter PDF:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
// Print Rejection Letter to PDF
export const printRejection = async (req, res) => {
    try {
        const userEmail = req.query.email;
        const selectedJobTitle = req.query.job;

        // Fetch user profile data from tblprofile
        const profileQuery = `
            SELECT firstname, lastname, employee_id, job_selected, score
            FROM tblprofile
            WHERE email = $1 AND job_selected = $2
        `;
        const profileResult = await pool.query(profileQuery, [userEmail, selectedJobTitle]);

        if (profileResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User profile not found" });
        }

        const { firstname, lastname, employee_id, job_selected, score } = profileResult.rows[0];
        const companyAddress = "Congressional Rd Ext, Barangay 171, Caloocan, Metro Manila";

        // Fetch HR details from tblaccount based on hrEmail
        const hrEmail = req.query.hrEmail;
        const hrQuery = `
            SELECT firstname, lastname, role
            FROM tblaccount
            WHERE account_email = $1
        `;
        const hrResult = await pool.query(hrQuery, [hrEmail]);

        if (hrResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "HR details not found" });
        }

        const { firstname: hrFirstname, lastname: hrLastname, role: hrRole } = hrResult.rows[0];

        const appraisalDate = format(new Date(), 'MMMM dd, yyyy');

        // Generate token with 1-week expiration
        const token = generateToken('7d');

        // Update tblprofile with the generated token
        const updateTokenQuery = `
            UPDATE tblprofile
            SET
                job_selected = NULL,
                current_phase = NULL,
                retries = NULL,
                score = NULL,
                result = NULL,
                restriction_token = $1
            WHERE email = $2 AND job_selected = $3
        `;
        await pool.query(updateTokenQuery, [token, userEmail, selectedJobTitle]);

        // Delete data from tblappraisal based on email and position
        const deleteAppraisalQuery = `
            DELETE FROM tblappraisal
            WHERE email = $1 AND position = $2
        `;
        await pool.query(deleteAppraisalQuery, [userEmail, selectedJobTitle]);

        // Create a PDF document
        const doc = new PDFDocument({ size: 'letter' });

        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            res
                .writeHead(200, {
                    'Content-Length': Buffer.byteLength(pdfData),
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=rejection_letter.pdf',
                })
                .end(pdfData);
        });

        // Header
        doc.image('../frontend/src/assets/appraisal/logo.png', 50, 45, { width: 100 });
        doc.moveDown();
        doc.fontSize(12).text(companyAddress, 50, 65, { align: 'left' });
        doc.text(appraisalDate, 50, 80, { align: 'left' });

        doc.moveDown(2);

        // Title
        doc.fontSize(16).text('Appraisal Letter – CONFIDENTIAL', { align: 'center', underline: true });
        doc.moveDown();

        // Employee details
        doc.fontSize(12).text(`Dear ${firstname} ${lastname},`);
        doc.moveDown();
        doc.text(`Employee ID: ${employee_id}`);
        doc.moveDown();

        // Rejection message
        doc.text(`We regret to inform you that based on your score on the assessment, we are unable to proceed with the ${job_selected} position at this time.`);
        doc.moveDown();
        doc.text(`Your recent assessment score was ${score}%, which does not meet our criteria for this role.`);
        doc.moveDown();
        doc.text(`We encourage you to continue your professional development and to retry for future opportunities.`);
        doc.moveDown();

        // Signature
        doc.image('../frontend/src/assets/appraisal/signature.png', 50, doc.y, { width: 100 });

        // Closing and HR details
        doc.text('Best regards,');
        doc.moveDown();
        doc.text(`${hrFirstname} ${hrLastname}`);
        doc.text(`${hrRole}`);

        // Finalize the PDF and end the stream
        doc.end();

    } catch (error) {
        console.error('Error generating rejection letter PDF:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

// Employee Work History ***********************************************
// Automatic ID
export const getNextJobId = async (req, res) => {
    try {
        // Query to select the maximum ID from tblworkhistory and increment it by 1
        const query = `
            SELECT COALESCE(MAX(id), 0) + 1 AS nextid FROM tblworkhistory
        `;

        // Execute the query
        const result = await pool.query(query);

        console.log("Query result:", result.rows[0]); // Log the query result

        // Extract the next ID from the result
        const nextId = parseInt(result.rows[0].nextid) || 1;

        console.log("Next job ID:", nextId); // Log the next job ID

        // Send the next ID as the response
        res.status(200).json({ nextId });
    } catch (error) {
        console.error('Error fetching next job ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Create/Add
export const addProfileJobInfo = async (req, res) => {
    try {
        // Extract employee ID from the request parameters
        const employeeId = req.params.editEmployeeId;

        // Extract job information from the request body
        const { company, jobTitle, skills, companyAddress, startDate, endDate } = req.body;

        // Query to insert new job information into the database
        const query = `
            INSERT INTO tblworkhistory (employee_id, company, job_title, skills, company_address, start_date, end_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;

        // Execute the query with the provided parameters
        await pool.query(query, [employeeId, company, jobTitle, skills, companyAddress, startDate, endDate]);

        // Send success response
        res.status(201).json({ message: 'New job information added successfully' });
    } catch (error) {
        console.error('Error adding new job information:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Autofill
export const getJobInfoById = async (req, res) => {
    try {
        const employeeId = req.params.editEmployeeId; // Assuming the employee ID is sent as a route parameter
        // Construct the SQL query to select all education history records for the employee
        const query = {
            text: `SELECT 
             id,
             company,
             job_title,
             skills,
             company_address,
             start_date,
             end_date
        FROM tblworkhistory WHERE employee_id = $1`,
            values: [employeeId],
        };
        // Execute the SQL query
        const result = await pool.query(query);
        // Check if any rows were found
        if (result.rows.length > 0) {
            const jobHistory = result.rows;
            // Send the job history data as JSON response
            res.status(200).json(jobHistory);
        } else {
            // If no education history records with the specified employee ID are found, send a 404 error
            res.status(404).json({ error: 'Job history not found for the employee' });
        }
    } catch (error) {
        console.error('Error fetching job history data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Edit
export const editJobInfo = async (req, res) => {
    try {
        const employeeId = req.params.editEmployeeId
        const { company, jobTitle, skills, companyAddress, startDate, endDate } = req.body;

        // Fetch the editJobInfoId from query parameters
        const editJobInfoId = req.query.editJobInfoId;

        // Update the job information in the tblworkhistory table
        const jobInfoQuery = `
            UPDATE tblworkhistory
            SET 
            company = $1,
            job_title = $2,
            skills = $3,
            company_address = $4,
            start_date = $5,
            end_date = $6
            WHERE employee_id = $7
            AND id = $8
        `;
        const jobInfoValues = [company, jobTitle, skills, companyAddress, startDate, endDate, employeeId, editJobInfoId];

        await pool.query(jobInfoQuery, jobInfoValues);

        res.status(200).json({ message: "Job information updated successfully." });
    } catch (error) {
        console.error("Error updating job information:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
// Delete
export const deleteProfileJobInfo = async (req, res) => {
    try {
        const { editEmployeeId, jobId } = req.params;

        // Query to delete the job history entry from the database
        const query = `
        DELETE FROM tblworkhistory
        WHERE employee_id = $1 AND id = $2
      `;

        // Execute the query with the provided parameters
        await pool.query(query, [editEmployeeId, jobId]);

        // Send success response
        res.status(200).json({ message: 'Job history deleted successfully' });
    } catch (error) {
        console.error('Error deleting job history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Employee Education History ***********************************************
// Automatic ID
export const getNextEduId = async (req, res) => {
    try {
        // Query to select the maximum ID from tblworkhistory and increment it by 1
        const query = `
            SELECT COALESCE(MAX(id), 0) + 1 AS nextid FROM tbleducbackground
        `;

        // Execute the query
        const result = await pool.query(query);

        console.log("Query result:", result.rows[0]); // Log the query result

        // Extract the next ID from the result
        const nextId = parseInt(result.rows[0].nextid) || 1;

        console.log("Next edu ID:", nextId); // Log the next edu ID

        // Send the next ID as the response
        res.status(200).json({ nextId });
    } catch (error) {
        console.error('Error fetching next edu ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Create/Add
export const addProfileEduInfo = async (req, res) => {
    try {
        // Extract employee ID from the request parameters
        const employeeId = req.params.editEmployeeId;

        // Extract job information from the request body
        const { school, yearGraduated, gradeLevel, degreeCourse } = req.body;

        // Query to insert new job information into the database
        const query = `
            INSERT INTO tbleducbackground (employee_id, school, year_graduated, grade_level, degree_course)
            VALUES ($1, $2, $3, $4, $5)
        `;

        // Execute the query with the provided parameters
        await pool.query(query, [employeeId, school, yearGraduated, gradeLevel, degreeCourse]);

        // Send success response
        res.status(201).json({ message: 'New edu information added successfully' });
    } catch (error) {
        console.error('Error adding new edu information:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Autofill
export const getEduInfoById = async (req, res) => {
    try {
        const employeeId = req.params.editEmployeeId; // Assuming the employee ID is sent as a route parameter
        // Construct the SQL query to select all education history records for the employee
        const query = {
            text: `SELECT 
             id,
             school,
             year_graduated,
             grade_level,
             degree_course
        FROM tbleducbackground WHERE employee_id = $1`,
            values: [employeeId],
        };
        // Execute the SQL query
        const result = await pool.query(query);
        // Check if any rows were found
        if (result.rows.length > 0) {
            const eduHistory = result.rows;
            // Send the job history data as JSON response
            res.status(200).json(eduHistory);
        } else {
            // If no education history records with the specified employee ID are found, send a 404 error
            res.status(404).json({ error: 'Education history not found for the employee' });
        }
    } catch (error) {
        console.error('Error fetching education history data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Edit
export const editEduInfo = async (req, res) => {
    try {
        const employeeId = req.params.editEmployeeId
        const { school, yearGraduated, gradeLevel, degreeCourse } = req.body;

        // Fetch the editJobInfoId from query parameters
        const editEduInfoId = req.query.editEduInfoId;

        // Update the job information in the tblworkhistory table
        const eduInfoQuery = `
            UPDATE tbleducbackground
            SET 
            school = $1,
            year_graduated = $2,
            grade_level = $3,
            degree_course = $4
            WHERE employee_id = $5
            AND id = $6
        `;
        const eduInfoValues = [school, yearGraduated, gradeLevel, degreeCourse, employeeId, editEduInfoId];

        await pool.query(eduInfoQuery, eduInfoValues);

        res.status(200).json({ message: "Edu information updated successfully." });
    } catch (error) {
        console.error("Error updating edu information:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
// Delete
export const deleteProfileEduInfo = async (req, res) => {
    try {
        const { editEmployeeId, eduId } = req.params;

        // Query to delete the job history entry from the database
        const query = `
        DELETE FROM tbleducbackground
        WHERE employee_id = $1 AND id = $2
      `;

        // Execute the query with the provided parameters
        await pool.query(query, [editEmployeeId, eduId]);

        // Send success response
        res.status(200).json({ message: 'Edu history deleted successfully' });
    } catch (error) {
        console.error('Error deleting edu history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};