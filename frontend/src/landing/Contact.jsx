import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// CSS
import './styles/Contact.css';

// Images
import logo from '../assets/homepage/final-topright-logo.png';
import footerlogo from "../assets/homepage/footerlogo.png";

const Contact = () => {

    const Logo = logo;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();
    const handleAboutClick = () => {
        navigate("/About");
    };

    const handleHomeClick = () => {
        navigate("/");
    };

    const handleContactClick = () => {
        navigate("/Contact-Us");
    };

    //Contact Us Connection
    const sendEmail = async () => {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await axios.post('http://localhost:8800/api/auth/send-email', { name, email, message });

            if (response.status === 200) {
                setSuccessMessage(<span style={{ color: 'green' }}> Message Sent. Thanks for the Feedback </span>);
                setName('');
                setEmail('');
                setMessage('');
            } else {
                setErrorMessage('Failed to send message');
            }
        } catch (error) {
            console.error('An error occurred while sending the message:', error);
            setErrorMessage('An error occurred while sending the message');
        }
    };

    // Function to handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        await sendEmail();
    };

    // Message Limit
    const charLimit = 250;
    const handleChange = (event) => {
        const newMessage = event.target.value;
        setMessage(newMessage);

        if (newMessage.length > charLimit) {
            setMessage(newMessage.substring(0, charLimit));
        }
    }

    return (
        <>
            {/* Navigation Bar */}
            <nav className="navigationbarWrapper">
                <div className="navbarInner">
                    <div className="navLeft">
                        <img
                            src={Logo}
                            alt="logo"
                            className="brand"
                            onClick={handleHomeClick}
                        />
                    </div>

                    <div className="login-container">
                        <btn className="login-text">Log in</btn>
                        <btn className="Signup-text">Sign up</btn>
                    </div>
                    {/* Login and About Header
                    <div className="navRight">
                        <button className="about" onClick={handleAboutClick}>
                            About Us
                        </button>
                        <button className="login" onClick={handleLoginClick}>
                            Log In
                        </button>
                    </div>
                    */}
                </div>
            </nav>
            {/* End of Navigation Bar */}
            {/* Contact Us Section*/}
            <div className="contactUsWrapper">
                <div className="contactForm">
                    <div className="contactInputs">
                        <h1> Contact Form </h1>
                        {errorMessage && <div className="error-message">{errorMessage}</div>}
                        {successMessage && <div className="success-message">{successMessage}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="contactInput">
                                <label> Name </label>
                                <input
                                    type="text"
                                    placeholder=""
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="contactInput">
                                <label> Email Address </label>
                                <input
                                    type="email"
                                    placeholder=""
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="contactTextArea">
                                <label> Message Here </label>
                                <textarea
                                    rows='5'
                                    value={message}
                                    onChange={(e) => {
                                        setMessage(e.target.value),
                                            handleChange(e, message)
                                    }}
                                    required
                                />
                                <p id="char-count">
                                    {message.length}/{charLimit}
                                </p>
                            </div>
                            <div className="contactSubmit">
                                <button
                                    className="contactSubmitButtton"
                                    placeholder=''
                                    disabled={message.length > charLimit}
                                > Send
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="contactInfoContainer">
                    <div className="contactInfoForm">
                        <div className="contactInfoHeader">
                            <h1> Contact Info </h1>
                        </div>
                        <div className="contactInfoDetails">
                            <p> The purpose of this page is to provide users with a way to ask questions, report issues, or
                                provide feedback to the website owners. It helps to establish trust and build relationships with
                                users, as well as improve the overall user experience on the website. </p>
                        </div>
                        <div className="contactInfoContact">
                            <div className="contactInfoItem">
                                <p1>Address:</p1>
                                <p>Congressional Rd Ext, Barangay 171, Caloocan, Metro Manila</p>
                            </div>
                            <div className="contactInfoItem">
                                <p1>Email Address:</p1>
                                <p><u>careercompassbscs@gmail.com</u></p>
                            </div>
                            <div className="contactInfoItem">
                                <p1>Phone:</p1>
                                <p><u>+63 909 169 7716</u></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* End of Contact Us Section*/}
            <nav className="footerNavbarWrapper">
                <div className="footerNavbarColumn">
                    <div className="footerNavbarInner">
                        <div className="footerLogoWrapper">
                            <div className="footerNavleft">
                                <img
                                    src={footerlogo}
                                    alt="Logo"
                                    className="footerLogo"
                                    onClick={handleHomeClick}
                                />
                            </div>
                            <div className="footerConnect">
                                <h1 className="connectWithUsText"> Connect with us </h1>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <span style={{ margin: "0 10px" }}>
                                        <a
                                            href="#facebook"
                                            className="fab fa-facebook-square fa-4x"
                                            style={{ color: "white" }}
                                        >
                                            {""}
                                        </a>
                                    </span>
                                    <span style={{ margin: "0 10px" }}>
                                        <a
                                            href="#google"
                                            className="fab fa-google fa-4x"
                                            style={{ color: "white" }}
                                        >
                                            {""}
                                        </a>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="footerAbout">
                            <h1 className="footerAboutHeader"> Our Team </h1>
                            <a
                                href="/About"
                                className="footerAboutLink"
                                onClick={handleAboutClick}
                            >
                                {" "}
                                About Us{" "}
                            </a>
                            <a href="" className="footerAboutLink">
                                {" "}
                                Mission and Vision{" "}
                            </a>
                            <a href="/Contact-Us" className="footerAboutLink" onClick={handleContactClick}>
                                {" "}
                                Contact us{" "}
                            </a>
                        </div>
                    </div>
                    <div className="underline" />
                    <div className="footerText">
                        <p className="footerTextCopyright">
                            Copyright &#169; CareerCompass. All Rights Reserved
                        </p>
                    </div>
                </div>
            </nav>
            {/* End of Footer */}
        </>
    )
};

export default Contact;