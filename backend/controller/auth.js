import { db } from "../database.js";
import bcrypt from "bcryptjs";

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

// User Page

// User Profile Page

// Recommend Algorithm

// Select Jobs