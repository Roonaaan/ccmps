import React from "react";
import { useNavigate } from "react-router-dom";

//Assets
import "./styles/About.css";
import './styles/Contact.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookSquare, faYoutube, faGithub } from "@fortawesome/free-brands-svg-icons";
import logo from "../assets/homepage/final-topright-logo-light.png";
import footerlogo from "../assets/homepage/footerlogo-dark.png";
import Group from "../assets/aboutus/grouppicture.jpg"
import profile1 from "../assets/aboutus/ppRonan.jpg";
import profile2 from "../assets/aboutus/ppBulawan.jpg";
import profile3 from "../assets/aboutus/ppPajerga.jpg";
import profile5 from "../assets/aboutus/ppDeJesus.png";
import profile6 from "../assets/aboutus/pplucky.jpg";
import profile7 from "../assets/aboutus/ppMongaya.jpg";
import profile8 from "../assets/aboutus/ppMabuti.jpg";
import profile9 from "../assets/aboutus/ppGenove.jpg";

const About = () => {
  const Logo = logo;
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

  return (
    <>
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
      <div className="aboutGroup">
        <div className="aboutGroupContainer">
          <div className="aboutGroupContainerPanel">
            <div className="aboutGroupContainerPanelImage">
              <div className="aboutGroupContainerPanelRight">

              </div>
            </div>
          </div>
        </div>
      </div>
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
  );
};
export default About;