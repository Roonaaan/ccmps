import pg from 'pg';
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from 'crypto';

const pool = new pg.Pool({ // Use 'pg.Pool' instead of 'Pool'
    connectionString: "postgres://default:NpLQ8gFc1dsD@ep-aged-meadow-a1op3qk0-pooler.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require", // Get connection string from environment variable
    ssl: {
        rejectUnauthorized: false, // Use this option only if necessary
    }
});

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

// Generate Token
const generateResetToken = () => {
    // Generate a random token using crypto module
    const token = crypto.randomBytes(20).toString('hex');
    return token;
};

// Reset Password Request (Send Email)
export const sendResetEmail = async (req, res) => {
    const { email } = req.body;
    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    try {
        // Acquire a client from the pool
        const client = await pool.connect();

        try {
            // Prepare and execute the query using a prepared statement
            const insertQuery = `
          INSERT INTO tblforgotpass (email, reset_token, reset_token_expiry)
          VALUES ($1, $2, $3)
        `;
            const result = await client.query(insertQuery, [email, resetToken, resetTokenExpiry]);

            // Check query execution result
            if (result.rowCount > 0) {
                console.log('Reset token inserted successfully');

                // Send reset password email (logic remains unchanged)
                const transporter = nodemailer.createTransport({
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
                    text: `To reset your password, click on the following link: https://ccmps.vercel.app/Login/Forgot-Password/Change-Password?token=${resetToken}` // Email body with the reset token link
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
                console.warn('No rows affected by the query');
                throw new Error('Failed to insert reset token');
            }
        } catch (error) {
            // Handle database-specific errors
            if (error.code) { // Check for Postgres error codes (optional)
                console.error('Database error:', error.code, error.message);
                // Handle specific error codes here (e.g., unique constraint violations)
                res.status(500).json({ success: false, message: 'An error occurred while processing the request (Database error)' });
            } else {
                console.error('Error occurred during database operation:', error);
                res.status(500).json({ success: false, message: 'An error occurred while processing the request (Database operation error)' });
            }
        } finally {
            await client.release(); // Release the client back to the pool
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        res.status(500).json({ success: false, message: 'An unexpected error occurred' });
    }
};
// Reset Password Resend Email
export const resendResetEmail = async (req, res) => {
    const { email } = req.body;
    const resetToken = generateResetToken(); // Generate a new reset token
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // Set reset token expiry to 10 minutes from now

    try {
        const client = await pool.connect(); // Acquire a client from the pool

        try {
            // Prepare and execute the update query using placeholders
            const updateQuery = `
          UPDATE tblforgotpass
          SET reset_token = $1, reset_token_expiry = $2
          WHERE email = $3
        `;
            const result = await client.query(updateQuery, [resetToken, resetTokenExpiry, email]);

            // Check if any rows were affected
            if (result.rowCount > 0) {
                console.log('Reset token updated successfully');

                // Send reset password email (logic remains unchanged)
                const transporter = nodemailer.createTransport({
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

                res.status(200).json({ success: true, message: 'Reset password email resent successfully' });
            } else {
                console.warn('No rows were updated in the database');
                throw new Error('Failed to update reset token');
            }
        } catch (error) {
            console.error('Error occurred during database operation:', error);
            res.status(500).json({ success: false, message: 'An error occurred while resending reset password email' });
        } finally {
            await client.release(); // Release the client back to the pool
        }
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        res.status(500).json({ success: false, message: 'An error occurred while processing the request' });
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

        // Store user input in the database (using prepared statement)
        const insertQuery = `
        INSERT INTO tblcontactus (name, email, message)
        VALUES ($1, $2, $3)
      `;
        db.query(insertQuery, [name, email, message], (err, result) => {
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
        const selectedJobTitle = req.query.job;

        const query = `
        SELECT score
        FROM tblprofile
        WHERE email = $1 AND job_selected = $2
      `;
        const values = [userEmail, selectedJobTitle];

        const result = await pool.query(query, values);

        if (result.rows.length > 0 && result.rows[0].score !== null) {
            res.json({ success: true, message: "There is a Data inside" });
        } else {
            res.json({ success: true, message: "No data inputted" });
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

// Appraisal Formula
export const appraisalCalculate = async (req, res) => {
    try {
        const userEmail = req.query.email;
        const selectedJobTitle = req.query.job;

        // Fetch user profile data from tblprofile
        const profileQuery = `
            SELECT score, retries, job_selected
            FROM tblprofile
            WHERE email = $1 AND job_selected = $2
        `;
        const profileResult = await pool.query(profileQuery, [userEmail, selectedJobTitle]);

        if (profileResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User profile not found" });
        }

        const { score, retries } = profileResult.rows[0];

        // Calculate the appraisal score
        let appraisalScore = score * 0.6 + (80 - retries * 5) * 0.4;
        appraisalScore = Number(appraisalScore.toFixed(3)); // Round to three decimal places

        // Determine the outcome
        let outcome;
        if (appraisalScore > 90) {
            outcome = "Promotion";
        } else if (appraisalScore >= 80 && appraisalScore <= 90) {
            outcome = "30% Salary Increase"; // You can determine the exact percentage here based on your organization's policies
        } else {
            outcome = "No Change";
        }

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

// Employee Dashboard Info CRUD
// Create
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

// Employee Profile
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

// Employee Appraisal
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

{/* Disabled Since On Progress
// Add Edu Info
// Edit Edu Info
export const editEduInfo = async (req, res) => {
    try {
        const { employee_id, school, yearGraduated, gradeLevel, degree } = req.body;

        // Update the employee information in the tblprofile table
        const profileQuery = `
            UPDATE tbleducbackground
            SET 
                school = $1,
                year_graduated = $2,
                grade_level = $3,
                degree_course = $4
            WHERE employee_id = $5
        `;
        const profileValues = [school, yearGraduated, gradeLevel, degree, employee_id];
        await pool.query(profileQuery, profileValues);

        res.status(200).json({ message: "Employee information updated successfully." });
    } catch (error) {
        console.error("Error updating employee information:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
// Edit Edu Info Autofill
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
            const educationHistory = result.rows;
            // Send the education history data as JSON response
            res.status(200).json(educationHistory);
        } else {
            // If no education history records with the specified employee ID are found, send a 404 error
            res.status(404).json({ error: 'Education history not found for the employee' });
        }
    } catch (error) {
        console.error('Error fetching education history data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Delete Edu Info

// Add Job Info
// Edit Job Info
export const editJobInfo = async (req, res) => {
    try {
        const { employee_id, company, jobTitle, skills, companyAddress, startDate, endDate } = req.body;

        // Update the employee information in the tblprofile table
        const profileQuery = `
            UPDATE tblworkhistory
            SET 
            company = $1,
            job_title = $2,
            skills = $3,
            company_address = $4,
            start_date = $5,
            end_date = $6
            WHERE employee_id = $7
        `;
        const profileValues = [company, jobTitle, skills, companyAddress, startDate, endDate, employee_id];
        await pool.query(profileQuery, profileValues);

        res.status(200).json({ message: "Employee information updated successfully." });
    } catch (error) {
        console.error("Error updating employee information:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
// Edit Job Info Autofill
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
// Delete Job Info

// Employee Education History CRUD
// Create
export const addEduHistory = async (req, res) => {
    try {
        const {
            employeeId,
            school,
            yearGraduated,
            gradeLevel,
            degree
        } = req.body;

        // Connect to the database
        const client = await pool.connect();
        await client.query(`
            INSERT INTO tbleducbackground (
                employee_id,
                school,
                year_graduated,
                grade_level,
                degree_course
            ) VALUES (
                $1, $2, $3, $4, $5
            )
        `, [
            employeeId,
            school,
            yearGraduated,
            gradeLevel,
            degree
        ]);

        client.release();

        // Send success response
        res.status(201).json({ message: 'Education history added successfully' });
    } catch (error) {
        console.error('Error adding education history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Read
export const readEduHistory = async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`
        SELECT 
        p.employee_id, 
        p.firstname, 
        p.lastname,
        e.school,
        e.year_graduated,
        e.grade_level,
        e.degree_course
    FROM 
        tblprofile p
    JOIN 
        tbleducbackground e ON p.employee_id = e.employee_id;
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
export const editEduHistory = async (req, res) => {
    try {
        const { employee_id, school, yearGraduated, gradeLevel, degree } = req.body;

        // Update the employee information in the database
        const query = `
            UPDATE tbleducbackground
            SET 
                school = $1,
                year_graduated = $2,
                grade_level = $3,
                degree_course = $4
            WHERE employee_id = $5
        `;

        const values = [school, yearGraduated, gradeLevel, degree, employee_id]; // Include employee_id
        await pool.query(query, values);

        res.status(200).json({ message: "Employee information updated successfully." });
    } catch (error) {
        console.error("Error updating employee information:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
// Autofill Edit Panel
export const getEduHistoryById = async (req, res) => {
    try {
        const employeeId = req.params.editEmployeeId; // Assuming the employee ID is sent as a route parameter
        // Construct the SQL query to select employee data based on employee ID
        const query = {
            text: `SELECT 
             school,
             year_graduated,
             grade_level,
             degree_course
        FROM tbleducbackground WHERE employee_id = $1`,
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
export const deleteEduHistory = async (req, res) => {
    const employeeId = req.body.employeeId; // Retrieve employee ID from request body

    if (!employeeId) {
        return res.status(400).json({ error: 'Employee ID not provided in the request body' });
    }

    try {
        // Construct the SQL query to delete the row with the specified employee ID
        const query = {
            text: `
                UPDATE tbleducbackground
                SET school = NULL, year_graduated = NULL, grade_level = NULL, degree_course = NULL
                WHERE employee_id = $1
            `,
            values: [employeeId],
        };

        // Execute the SQL query
        const result = await pool.query(query);

        // Check if any row was affected
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Employee deleted successfully' });
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Employee Job History CRUD
// Create
export const addJobHistory = async (req, res) => {
    try {
        const {
            employeeId,
            jobTitle,
            company,
            companyAddress,
            skills,
            startDate,
            endDate
        } = req.body;

        // Connect to the database
        const client = await pool.connect();
        await client.query(`
            INSERT INTO tblworkhistory (
                employee_id,
                company,
                job_title,
                skills,
                company_address,
                start_date,
                end_date
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7
            )
        `, [
            employeeId,
            jobTitle,
            company,
            companyAddress,
            skills,
            startDate,
            endDate
        ]);

        client.release();

        // Send success response
        res.status(201).json({ message: 'Job history added successfully' });
    } catch (error) {
        console.error('Error adding Job history:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Read
export const readJobHistory = async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`
        SELECT 
        p.employee_id, 
        p.firstname, 
        p.lastname,
        w.company,
        w.job_title,
        w.skills,
        w.company_address,
        w.start_date,
        w.end_date
    FROM 
        tblprofile p
    JOIN 
        tblworkhistory w ON p.employee_id = w.employee_id;

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
export const editJobHistory = async (req, res) => {
    try {
        const { employee_id, company, jobTitle, skills, companyAddress, startDate, endDate } = req.body;

        // Update the employee information in the database
        const query = `
            UPDATE tblworkhistory
            SET 
                company = $1,
                job_title = $2,
                skills = $3,
                company_address = $4,
                start_date = $5,
                end_date = $6
            WHERE employee_id = $7
        `;

        const values = [company, jobTitle, skills, companyAddress, startDate, endDate, employee_id]; // Include employee_id
        await pool.query(query, values);

        res.status(200).json({ message: "Employee information updated successfully." });
    } catch (error) {
        console.error("Error updating employee information:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
// Autofill Edit Panel
export const getJobHistoryById = async (req, res) => {
    try {
        const employeeId = req.params.editEmployeeId; // Assuming the employee ID is sent as a route parameter
        // Construct the SQL query to select employee data based on employee ID
        const query = {
            text: `SELECT 
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
export const deleteJobHistory = async (req, res) => {
    const employeeId = req.body.employeeId; // Retrieve employee ID from request body

    if (!employeeId) {
        return res.status(400).json({ error: 'Employee ID not provided in the request body' });
    }

    try {
        // Construct the SQL query to delete the row with the specified employee ID
        const query = {
            text: `
                UPDATE tblworkhistory 
                SET company = NULL, job_title = NULL, skills = NULL, company_address = NULL, start_date = NULL, end_date = NULL
                WHERE employee_id = $1
            `,
            values: [employeeId],
        };

        // Execute the SQL query
        const result = await pool.query(query);

        // Check if any row was affected
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Employee deleted successfully' });
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Employee Job Info CRUD
// Read
export const readJobInfo = async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`
            SELECT 
                employee_id, 
                firstname, 
                lastname, 
                job_position, 
                job_level,
                skills
            FROM tblprofile;
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
{/*
export const editJobInfo = async (req, res) => {
    try {
        const { employee_id, jobPosition, jobLevel, skills } = req.body;

        // Update the employee information in the database
        const query = `
            UPDATE tblprofile 
            SET 
                job_position = $1,
                job_level = $2,
                skills = $3
            WHERE employee_id = $4
        `;

        const values = [jobPosition, jobLevel, skills, employee_id]; // Include employee_id
        await pool.query(query, values);

        res.status(200).json({ message: "Employee information updated successfully." });
    } catch (error) {
        console.error("Error updating employee information:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
// Autofill Edit Panel

export const getJobInfoById = async (req, res) => {
    try {
        const employeeId = req.params.editEmployeeId; // Assuming the employee ID is sent as a route parameter
        // Construct the SQL query to select employee data based on employee ID
        const query = {
            text: `SELECT 
             job_position,
             job_level,
             skills
        FROM tblprofile WHERE employee_id = $1`,
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
export const deleteJobInfo = async (req, res) => {
    const employeeId = req.body.employeeId; // Retrieve employee ID from request body

    if (!employeeId) {
        return res.status(400).json({ error: 'Employee ID not provided in the request body' });
    }

    try {
        // Construct the SQL query to delete the row with the specified employee ID
        const query = {
            text: `
                UPDATE tblprofile 
                SET job_position = NULL, job_level = NULL, skills = NULL
                WHERE employee_id = $1
            `,
            values: [employeeId],
        };

        // Execute the SQL query
        const result = await pool.query(query);

        // Check if any row was affected
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Employee deleted successfully' });
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Employee Account Info CRUD
// Read
export const readAccountInfo = async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query(`
            SELECT 
                employee_id, 
                firstname, 
                lastname, 
                account_email, 
                account_password,
                account_password_plain,
                role
            FROM tblaccount;
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
export const editAccountInfo = async (req, res) => {
    try {
        const { employee_id, passwordPlain } = req.body;

        // Generate a salt for password hashing
        const saltRounds = 10; // Adjust this value as needed (higher = slower but more secure)
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(passwordPlain, salt);

        // Update the employee information with hashed password
        const query = `
        UPDATE tblaccount 
        SET 
          account_password_plain = $1,
          account_password =$2
        WHERE employee_id = $3
      `;

        const values = [passwordPlain, hashedPassword, employee_id]; // Use hashedPassword instead of passwordPlain

        await pool.query(query, values);

        res.status(200).json({ message: "Employee information updated successfully." });
    } catch (error) {
        console.error("Error updating employee information:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
// Autofill Edit Panel
export const getAccountInfoById = async (req, res) => {
    try {
        const employeeId = req.params.editEmployeeId; // Assuming the employee ID is sent as a route parameter
        // Construct the SQL query to select employee data based on employee ID
        const query = {
            text: `SELECT
             account_password_plain
        FROM tblaccount WHERE employee_id = $1`,
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
export const deleteAccountInfo = async (req, res) => {
    const employeeId = req.body.employeeId; // Retrieve employee ID from request body

    if (!employeeId) {
        return res.status(400).json({ error: 'Employee ID not provided in the request body' });
    }

    try {
        // Construct the SQL query to delete the row with the specified employee ID
        const query = {
            text: `
                UPDATE tblaccount 
                SET account_password = NULL, account_password_plain = NULL
                WHERE employee_id = $1
            `,
            values: [employeeId],
        };

        // Execute the SQL query
        const result = await pool.query(query);

        // Check if any row was affected
        if (result.rowCount > 0) {
            res.status(200).json({ message: 'Employee deleted successfully' });
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
*/}
