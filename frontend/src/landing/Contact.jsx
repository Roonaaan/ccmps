import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Assets
import './styles/Contact.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookSquare, faYoutube, faGithub } from "@fortawesome/free-brands-svg-icons";
import logo from "../assets/homepage/final-topright-logo-light.png";
import footerlogo from "../assets/homepage/footerlogo-dark.png";

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8800/api/auth/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Email Sent Successfully');
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            console.error('Error sending email:', error);
            setErrorMessage('An error occurred while sending the email');
        }
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
            <ToastContainer />
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
            {/* Footer */}
            <div className="footerNavbarWrapper">
                <div className="footerNavbarColumn">
                    <div className="footerNavbarInner">
                        <div className="footerLogoWrapper">
                            <a href="#top">
                                <img src={footerlogo} alt="Logo" className="footerLogo" />
                            </a>
                        </div>
                        <div className="footerConnect">
                            <div className="footerConnectIcon" style={{ display: "flex", justifyContent: "center" }}>
                                <span style={{ margin: "0 10px" }}>
                                    <a href="https://www.facebook.com/people/CareerCompass/61558113852266/" style={{ color: "#27374D" }}>
                                        <FontAwesomeIcon icon={faFacebookSquare} size="4x" />
                                    </a>
                                </span>
                                <span style={{ margin: "0 10px" }}>
                                    <a href="http://www.youtube.com/@CareerCompass-td2oq" style={{ color: "#27374D" }}>
                                        <FontAwesomeIcon icon={faYoutube} size="4x" />
                                    </a>
                                </span>
                                <span style={{ margin: "0 10px" }}>
                                    <a href="https://github.com/Roonaaan/ccmps" style={{ color: "#27374D" }}>
                                        <FontAwesomeIcon icon={faGithub} size="4x" />
                                    </a>
                                </span>
                            </div>
                        </div>
                        <div className="footerAbout">
                            <a
                                href="/About"
                                className="footerAboutLink"
                                onClick={handleAboutClick}
                            >
                                {" "}
                                About Us{" "}
                            </a>
                            <a
                                href="/Contact-Us"
                                className="footerAboutLink"
                                onClick={handleContactClick}
                            >
                                {" "}
                                Contact us{" "}
                            </a>
                        </div>
                    </div>
                    <div className="footerUnderline" />
                    <div className="footerText">
                        <p className="footerTextCopyright">
                            Copyright &#169; 2024 CareerCompass. All Rights Reserved
                        </p>
                    </div>
                </div>
            </div>
            {/* End of Footer */}
        </>
    )
};

export default Contact;