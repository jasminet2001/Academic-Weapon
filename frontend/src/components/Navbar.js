import React from "react";

const BottomNavbar = ({ toggleComponent }) => {
  return (
    <nav
      className="navbar navbar-dark shadow-lg p-2 pt-5"
      style={{
        display: "flex", // Flexbox container
        flexDirection: "column", // Arrange items in a column
        justifyContent: "flex-start", // Align items at the start of the container
        alignItems: "center", // Center items horizontally
        gap: "60px", // Space between buttons
        width: "80px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <button className="btn btn-success">
        <span size="3em" className="bi bi-person-fill" />
      </button>

      <button
        className="btn btn-success"
        onClick={() => toggleComponent("timer")}
      >
        <span size="3em" className="bi bi-stopwatch" />
      </button>

      <button
        className="btn btn-success"
        onClick={() => toggleComponent("todo")}
      >
        <span size="3em" className="bi bi-list-task" />
      </button>

      <button
        className="btn btn-success"
        onClick={() => toggleComponent("notes")}
      >
        <span size="3em" className="bi bi-journal-richtext" />
      </button>

      <button
        className="btn btn-success"
        onClick={() => toggleComponent("calendar")}
      >
        <span size="3em" className="bi bi-calendar-day" />
      </button>

      <button
        className="btn btn-success"
        onClick={() => toggleComponent("playlist")}
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
