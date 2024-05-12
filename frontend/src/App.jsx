import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Landing, About Us and Login Page
import Home from "./landing/Home";
import About from "./landing/About";
import ContactUs from "./landing/Contact";

// Admin Page
import AdminHome from "./admin/Home";
import AdminLogin from "./admin/Login";

// Signed-In user page
import ForgotPasswordChange from "./landing/forgot-password/Forgotpasschange";

// Signed-In user page
import Welcome from "./signed_in/Home";
import EmpProfile from "./signed_in/Profile";
import Recommend from "./signed_in/Recommend/Recommend";
import SelectDept from "./signed_in/Recommend/Selected";
import Roadmap from "./signed_in/Roadmap/Roadmap";
import Assessment from "./signed_in/Roadmap/Assessment";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Landing, About Us and Login Page */}
          <Route path="/" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Contact-Us" element={<ContactUs />} />

          {/* Forgot Password Page */}
          <Route path="/Login/Forgot-Password/Change-Password" element={<ForgotPasswordChange />} />

          {/* Signed-In User Page */}
          <Route path="/Welcome" element={<Welcome />} />
          <Route path="/My-Profile" element={<EmpProfile />} />
          <Route path="/Recommend" element={<Recommend />} />
          <Route path="/Select-Department" element={<SelectDept />} />
          <Route path="/Roadmap" element={<Roadmap />} />
          <Route path="/Roadmap/Assessment" element={<Assessment />} />

          {/* Admin Page */}
          <Route path="/Admin" element={<AdminLogin />} />
          <Route path="/Admin/Welcome" element={<AdminHome />} />
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
