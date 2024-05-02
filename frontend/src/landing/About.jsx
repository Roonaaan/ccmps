import React from "react";
import { useNavigate } from "react-router-dom";
//CSS
import "./styles/About.css";
//images
import logo from "../assets/homepage/final-topright-logo.png";
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
  const handleHomeClick = () => {
    navigate("/");
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

    </>
  );
};
export default About;