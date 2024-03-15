import React from "react";
import { useNavigate } from "react-router-dom";
//CSS
import "./styles/About.css";
//images
import logo from "../assets/homepage/final-topright-logo.png";
import profile1 from "../assets/aboutus/ppRonan.jpg";
import profile2 from "../assets/aboutus/ppBulawan.jpg";
import profile3 from "../assets/aboutus/ppPajerga.jpg";
import profile4 from "../assets/aboutus/ppVillaluz.jpg";
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
      
      <section className="description compass">
          <p className="header-section">
            {" "}
            WE'RE GUIDING YOU TO FIND THE RIGHT CAREER PATH{" "}

            
          </p>
          <p className="sub-heading">
            {" "}
            The team behind CareerCompass aims to develop a system that provides
            a comprehensive guide for employees within a company to achieve
            their intended roles with the assistance of Artificial Intelligence
            (AI). We're more than just a group of students; we're a dynamic
            force of change-makers who believe in the power of collaboration,
            innovation, and the unique views that each team member brings to the
            table. As we embark on this exciting journey, we encourage you to
            join us in creating CareerCompass's future. Let us work together to
            turn obstacles into opportunities and leave a legacy of innovation
            that extends beyond academic bounds.
          </p>
      </section>

      <section className="description mission">
          <p className="header mission-heading"> MISSION </p>
          <p className="mission-sub-heading">
            {" "}
            Our goal is simple: empower employees by generating personalized
            career roadmaps based on their unique work experiences and skills.
            Through cutting-edge technology and a user-centric approach, we aim
            to provide dynamic insights, break down barriers, and inspire
            confidence in navigating the ever-evolving professional landscape.
            Join us in reshaping the future of career empowerment, one
            personalized roadmap at a time.
          </p>
      </section>

      <section className="description profile-parent">
                  <div className="profile-container">
                    <p className="header ourTeamText">
                      OUR TEAM
                    </p>
                  </div>

                  <div className="profile-image-container">
                    <div className="profile-information bar">
                      <div className="display-picture-parent">
                        <img className="display-picture" src={ profile1 } alt="Ronan Display Image" />
                      </div>
                      <div className="name-role">
                        <p className="name"> Ramos, John Ronan </p>
                        <p className="role"> Project Manager </p>
                      </div>
                    </div>

                    <div className="profile-information bar">
                      <div className="display-picture-parent">
                        <img className="display-picture" src={ profile2 } alt="Ronan Display Image" />
                      </div>
                      <div className="name-role">
                        <p className="name"> Bulawan, Christoper M. </p>
                        <p className="role"> Software Engineer </p>
                      </div>
                    </div>

                    <div className="profile-information bar">
                      <div className="display-picture-parent">
                        <img className="display-picture" src={ profile3 } alt="Ronan Display Image" />
                      </div>
                      <div className="name-role">
                        <p className="name"> Pajerga, Michael John </p>
                        <p className="role"> Front-end Programmer </p>
                      </div>
                    </div>

                    <div className="profile-information bar">
                      <div className="display-picture-parent">
                        <img className="display-picture" src={ profile4 } alt="Ronan Display Image" />
                      </div>
                      <div className="name-role">
                        <p className="name"> Villaluz, Christian Jade </p>
                        <p className="role"> Front-end Programmer </p>
                      </div>
                    </div>

                    <div className="profile-information bar">
                      <div className="display-picture-parent">
                        <img className="display-picture" src={ profile5 } alt="Ronan Display Image" />
                      </div>
                      <div className="name-role">
                        <p className="name"> De Jesus, Shawn Michael </p>
                        <p className="role"> Front-end Programmer </p>
                      </div>
                    </div>

                    <div className="profile-information bar">
                      <div className="display-picture-parent">
                        <img className="display-picture" src={ profile6 } alt="Ronan Display Image" />
                      </div>
                      <div className="name-role">
                        <p className="name"> Dancel, Lucky </p>
                        <p className="role"> Assistant Software Engineer </p>
                      </div>
                    </div>

                    <div className="profile-information bar">
                      <div className="display-picture-parent">
                        <img className="display-picture" src={ profile7 } alt="Ronan Display Image" />
                      </div>
                      <div className="name-role">
                        <p className="name"> Mongaya, Faye Allyson </p>
                        <p className="role"> Back-end Programmer </p>
                      </div>
                    </div>

                    <div className="profile-information bar">
                      <div className="display-picture-parent">
                        <img className="display-picture" src={ profile8 } alt="Ronan Display Image" />
                      </div>
                      <div className="name-role">
                        <p className="name"> Mabuti, Adrian </p>
                        <p className="role"> Back-end Programmer </p>
                      </div>
                    </div>

                    <div className="profile-information bar">
                      <div className="display-picture-parent">
                        <img className="display-picture" src={ profile9 } alt="Ronan Display Image" />
                      </div>
                      <div className="name-role">
                        <p className="name"> Genove, Allan Jonas </p>
                        <p className="role"> Back-end Programmer </p>
                      </div>
                    </div>

                
                  </div>
      </section>
    </>
  );
};
export default About;
