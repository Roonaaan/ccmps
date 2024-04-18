import React, { Fragment, useState } from "react";
import { features } from "./constants/features";
import { useNavigate } from "react-router-dom";
import LoginModal from "./Login";


//link Home CSS
import "./styles/Home.css";

//link Images from Assets
import logo from "../assets/homepage/final-topright-logo.png";
import footerlogo from "../assets/homepage/footerlogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Home = () => {
  const Logo = logo;
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLoginClick = () => {
    setShowModal(true);
  };
  const handleAboutClick = () => {
    navigate("/About");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleContactClick = () => {
    navigate("/Contact-Us");
  };

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
        </div>
      </nav>
      {/* End of Navigation Bar */}

      {/* Hero */}
      <div className="heroWrapper">
        <div className="container">
          <div className="inner-frame">
            <p className="header-text">CREATE YOUR OWN ROADMAP</p>
            <p className="discover-text">
              Discover your own career path! Input your skills, experience, and
              our system crafts a personalize roadmap just for you.
            </p>
            <div className="heroButtonBar">
              <btn className="create-Button" onClick={handleLoginClick}>
                CREATE ROADMAP
              </btn>
            </div>
          </div>
        </div>
      </div>
      {/* End of Hero */}

      {/* Features */}
      <div className="featuresWrapper">
        <div className="featuresHeading">
          <p className="featureTitle"> MAIN FEATURES</p>
          <p className="mainFeaturesText">
            We aim to provide a guide for employees within this company to
            achieve your intended roles with the assistance of Artificial
            Inteligence(AI)
          </p>
        </div>
        <div className="featuresListWrapper">
          <div className="featuresList">
            {/* go to components/features.js */}
            {features.map(({ feature, description, image }) => {
              return (
                <div className="featureDiv">
                  <Fragment>
                    <div className="feature">
                      <p className="feature-name">{feature}</p>
                    </div>
                    <div className="featureDescription">
                      <p className="feature-text">{description}</p>
                    </div>
                    <div className="feature-image-placeholder">
                      <img className="featureImg" src={image} alt="img" />
                    </div>
                  </Fragment>
                </div>
              );
            })}
            {/* end */}
          </div>
        </div>
      </div>
      {/* End of Features */}

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
              <div className ="footerConnectIcon"style={{ display: "flex", justifyContent: "center" }}>
                <span style={{ margin: "0 10px" }}>
                  <a href="https://www.facebook.com/people/CareerCompass/61558113852266/" style={{ color: "white" }}>
                    <FontAwesomeIcon icon={faFacebookSquare} size="4x" />
                  </a>
                </span>
                <span style={{ margin: "0 10px" }}>
                  <a href="http://www.youtube.com/@CareerCompass-td2oq" style={{ color: "white" }}>
                    <FontAwesomeIcon icon={faYoutube} size="4x" />
                  </a>
                </span>
                <span style={{ margin: "0 10px" }}>
                  <a href="https://github.com/Roonaaan/ccmps" style={{ color: "white" }}>
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
          <div className="underline" />
          <div className="footerText">
            <p className="footerTextCopyright">
              Copyright &#169; CareerCompass. All Rights Reserved
            </p>
          </div>
        </div>
      </div>
      {/* End of Footer */}
      {showModal && <LoginModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Home;