import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BottomNavbar = ({ toggleComponent }) => {
  const navigate = useNavigate(); // For redirecting to StudyPage ("/")
  const location = useLocation(); // To check the current URL

  // Helper function to handle button clicks
  const handleClick = (component) => {
    if (location.pathname !== "/") {
      // If not on StudyPage ("/"), redirect to StudyPage
      navigate("/");
    } else {
      // If already on StudyPage, toggle component visibility
      toggleComponent(component);
    }
  };

  return (
    <nav
      className="navbar navbar-dark shadow-lg p-2 pt-5"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "60px",
        width: "80px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <button className="btn btn-success" onClick={() => navigate("/profile")}>
        <span size="3em" className="bi bi-person-fill" />
      </button>

      <button className="btn btn-success" onClick={() => handleClick("timer")}>
        <span size="3em" className="bi bi-stopwatch" />
      </button>

      <button className="btn btn-success" onClick={() => handleClick("todo")}>
        <span size="3em" className="bi bi-list-task" />
      </button>

      <button className="btn btn-success" onClick={() => handleClick("notes")}>
        <span size="3em" className="bi bi-journal-richtext" />
      </button>

      <button
        className="btn btn-success"
        onClick={() => handleClick("calendar")}
      >
        <span size="3em" className="bi bi-calendar-day" />
      </button>

      <button
        className="btn btn-success"
        onClick={() => handleClick("playlist")}
      >
        <span size="3em" className="bi bi-music-note-beamed" />
      </button>

      <button className="btn btn-danger">
        <span size="3em" className="bi bi-door-closed-fill" />
      </button>
    </nav>
  );
};

export default BottomNavbar;
