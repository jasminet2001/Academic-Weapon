import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const BottomNavbar = ({ toggleComponent }) => {
  const navigate = useNavigate(); // For redirecting to StudyPage ("/")
  const location = useLocation();

  const handleClick = (component) => {
    if (location.pathname !== "/") {
      // If not on StudyPage ("/"), redirect to StudyPage
      navigate("/");
    } else {
      // If already on StudyPage, toggle component visibility
      toggleComponent(component);
    }
  };
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const accessToken = localStorage.getItem("access_token");
      if (refreshToken && accessToken) {
        await axios.post(
          "http://localhost:8000/api/accounts/logout/",
          { refresh_token: refreshToken },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <nav
      className="navbar navbar-dark shadow-lg p-2 pt-4"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "40px",
        width: "80px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <button className="btn btn-success" onClick={() => navigate("/profile")}>
        <span size="1em" className="bi bi-person-fill" />
      </button>

      <button className="btn btn-success" onClick={() => handleClick("timer")}>
        <span size="1em" className="bi bi-stopwatch" />
      </button>

      <button className="btn btn-success" onClick={() => handleClick("todo")}>
        <span size="1em" className="bi bi-list-task" />
      </button>

      <button className="btn btn-success" onClick={() => handleClick("notes")}>
        <span size="1em" className="bi bi-journal-richtext" />
      </button>

      <button className="btn btn-success" onClick={() => navigate("/calendar")}>
        <span size="1em" className="bi bi-calendar-day" />
      </button>

      <button
        className="btn btn-success"
        onClick={() => handleClick("playlist")}
      >
        <span size="1em" className="bi bi-music-note-beamed" />
      </button>

      <button className="btn btn-success" onClick={() => navigate("/chat")}>
        <span size="1em" className="bi bi-robot" />
      </button>

      <button className="btn btn-success" onClick={() => navigate("/chart")}>
        <span size="1em" className="bi bi-pie-chart-fill" />
      </button>

      <button className="btn btn-danger" onClick={handleLogout}>
        <span size="1em" className="bi bi-door-closed-fill" />
      </button>
    </nav>
  );
};

export default BottomNavbar;
