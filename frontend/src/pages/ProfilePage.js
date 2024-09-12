import React, { useState } from "react";
import BottomNavbar from "../components/Navbar";
import EditProfile from "../components/Profile";
import "../Profile.css";
const ProfilePage = () => {
  return (
    <div className="container-fluid custom-container">
      <EditProfile />
    </div>
  );
};

export default ProfilePage;
