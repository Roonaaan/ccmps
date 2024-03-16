import { db } from "../database.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

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

// ResetPassword Request

// ResetPassword Email

// ResetPassword Reset

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

// User Profile Page

// Recommend Algorithm

// Select Jobs