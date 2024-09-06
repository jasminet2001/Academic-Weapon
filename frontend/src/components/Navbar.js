import React from "react";

const BottomNavbar = () => {
  return (
    <nav className="d-flex align-items-center navbar navbar-light bg-light w-25 mx-4 px-2 shadow-lg p-3 mb-5 bg-body rounded">
      {/* <button variant="light" className="p-0 border-0 me-2">
        <img
          src="https://via.placeholder.com/40" 
          alt="Gallery"
          className="rounded-circle"
          style={{ width: "40px", height: "40px" }}
        />
      </button> */}

      <button className="btn">
        <span size="1.5em" class="bi bi-person-fill" />
      </button>
      <div class="vr"></div>

      <button className="btn">
        <span size="1.5em" class="bi bi-stopwatch" />
      </button>

      <button className="btn">
        <span size="1.5em" class="bi bi-list-task" />
      </button>

      <button className="btn ">
        <span size="1.5em" class="bi bi-journal-richtext" />
      </button>

      <button className="btn me-2">
        <span size="1.5em" class="bi bi-calendar-day" />
      </button>

      <button className="btn me-2">
        <span size="1.5em" class="bi bi-music-note-beamed" />
      </button>

      <button className="btn">
        <span size="1.5em" class="bi bi-robot" />
      </button>
    </nav>
  );
};

export default BottomNavbar;
