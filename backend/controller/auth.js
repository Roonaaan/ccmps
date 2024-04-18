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

// Login
export const login = async (req, res) => {
    let client;

    try {
        client = await pool.connect();
        const result = await client.query("SELECT * FROM tblaccount WHERE account_email = $1", [req.body.email]);

        if (result.rows.length === 0) {
            return res.status(401).json("User not found!");
        }

        // Ensure ACCOUNT_PASSWORD is retrieved and handle potential missing value
        const { account_password, ...userData } = result.rows[0];
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
        // Retrieve the job title and phase from the query parameters
        const selectedJobTitle = req.query.job;
        const phase = parseInt(req.query.phase);

        if (!selectedJobTitle || isNaN(phase)) {
            return res.status(400).json({ error: 'No job title or phase provided' });
        }

        // Query the database for the assessment questions based on the job title and phase
        const client = await pool.connect();
        const result = await client.query('SELECT description, question_number, a, b, c, d, correct_choice FROM tblassessment WHERE position = $1 AND phase = $2', [selectedJobTitle, phase]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Assessment questions not found for the selected job and phase' });
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

// Store Answer
export const getAnswerStored = async (req, res) => {
    try {
        // Extract data from the request body
        const { email, position, answers } = req.body;

        // Construct the SQL query
        const query = `
            INSERT INTO tblroadmap (email, position, description, question, answer, result)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;

        // Iterate through each answer and execute the SQL query for each one
        for (const answer of answers) { // Use a different variable name here
            await pool.query(query, [email, position, answer.description, answer.question, answer.answer, answer.result]);
        }

        // Send a success response
        res.status(200).json({ message: 'Answers stored successfully' });
    } catch (error) {
        // Log the error message for debugging
        console.error('Error storing answers:', error);
        res.status(500).json({ error: 'An error occurred while storing the answers' });
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
}

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
}
// Select Jobs