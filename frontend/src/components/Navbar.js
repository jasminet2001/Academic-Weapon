import React from "react";

const BottomNavbar = ({ toggleComponent }) => {
  return (
    <nav className="d-flex align-items-center navbar navbar-light bg-light w-25 mx-4 px-2 shadow-lg p-3 mb-5 bg-body rounded">
      <button className="btn">
        <span size="1.5em" className="bi bi-person-fill " />
      </button>
      <div className="vr"></div>

      <button className="btn" onClick={() => toggleComponent("timer")}>
        <span size="1.5em" className="bi bi-stopwatch" />
      </button>

      <button className="btn" onClick={() => toggleComponent("todo")}>
        <span size="1.5em" className="bi bi-list-task" />
      </button>

      <button className="btn" onClick={() => toggleComponent("notes")}>
        <span size="1.5em" className="bi bi-journal-richtext" />
      </button>
      <button className="btn me-2" onClick={() => toggleComponent("calendar")}>
        <span size="1.5em" class="bi bi-calendar-day" />
      </button>

      <button className="btn me-2" onClick={() => toggleComponent("playlist")}>
        <span size="1.5em" className="bi bi-music-note-beamed" />
      </button>
    </nav>
  );
};

export default BottomNavbar;
