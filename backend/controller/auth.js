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

            // Encode image data to base64 for immediate display in the frontend
            const encodedImage = image ? Buffer.from(image).toString('base64') : null;

            const userData = {
                firstName: firstname,
                image: encodedImage // Include the encoded image in the response
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
      const client = await pool.connect(); // Get a connection from the pool
  
      try {
        const profileQuery = `
          SELECT
            p.employee_id,
            p.firstname,
            p.lastname,
            p.age,
            p.email,
            p.phone_number,
            p.home_address,
            p.district,
            p.city,
            p.province,
            p.postal_code,
            p.gender,
            p.birthday,
            p.nationality,
            p.civil_status,
            p.job_position,
            p.job_level,
            w.company,
            w.job_title,
            w.company_address,
            w.start_date,
            w.end_date,
            e.school AS EDU_SCHOOL,
            e.year_graduated,
            e.grade_level
          FROM tblprofile AS p
          LEFT JOIN tblworkhistory AS w ON p.employee_id = w.employee_id
          LEFT JOIN tbleducbackground AS e ON p.employee_id = e.employee_id
          WHERE p.EMAIL = $1
        `;
  
        const result = await client.query(profileQuery, [userEmail]); // Execute the query
  
        if (result.rowCount === 0) {
          return res.status(404).json({ success: false, message: "User profile not found" });
        }
  
        // Initialize user profile object
        const userProfile = {
          firstName: result[0].firstname,
          lastName: result[0].lastname,
          age: result[0].age,
          employeeId: result[0].employee_id,
          email: result[0].email,
          phoneNumber: result[0].phone_number,
          homeAddress: result[0].home_address,
          district: result[0].district,
          city: result[0].city,
          province: result[0].province,
          postalCode: result[0].postal_code,
          gender: result[0].gender,
          birthday: result[0].birthday,
          nationality: result[0].nationality,
          civilStatus: result[0].civil_status,
          jobPosition: result[0].job_position,
          jobLevel: result[0].job_level,
          employmentHistory: [],
          educationalHistory: [],
        };
  
        // Loop through results (alternative approach)
        for (const row of result.rows) {
          if (row.company && row.job_title && row.company_address && row.start_date && row.end_date) {
            userProfile.employmentHistory.push({
              company: row.company,
              jobTitle: row.job_title,
              companyAddress: row.company_address,
              startDate: row.start_date,
              endDate: row.end_date,
            });
          }
  
          if (row.EDU_SCHOOL && row.year_graduated && row.grade_level) {
            userProfile.educationalHistory.push({
              school: row.EDU_SCHOOL,
              yearGraduated: row.year_graduated,
              gradeLevel: row.grade_level,
            });
          }
        }
  
        res.status(200).json({ success: true, userProfile }); // Send successful response
  
      } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ success: false, message: "Error fetching user profile" });
      } finally {
        await client.release(); // Release the connection back to the pool
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      res.status(500).json({ success: false, message: "An error occurred" });
    }
  };
  
// Roadmap

// Select Jobs