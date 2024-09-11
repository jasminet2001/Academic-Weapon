import React, { useState } from "react";
import NotesApp from "../components/Notes";
import Timer from "../components/Timer";
import TodoApp from "../components/ToDo";
import CalendarComponent from "../components/Calendar";
import PlaylistPlayer from "../components/PlaylistPlayer";
import BottomNavbar from "../components/Navbar";
import Chatbot from "../components/Chatbot";

const StudyPage = () => {
  const [showNotes, setShowNotes] = useState(true);
  const [showTimer, setShowTimer] = useState(true);
  const [showTodo, setShowTodo] = useState(true);
  const [showCalendar, setShowCalendar] = useState(true);
  const [showPlaylist, setShowPlaylist] = useState(true);

  const toggleComponentVisibility = (component) => {
    switch (component) {
      case "notes":
        setShowNotes((prev) => !prev);
        break;
      case "timer":
        setShowTimer((prev) => !prev);
        break;
      case "todo":
        setShowTodo((prev) => !prev);
        break;
      case "calendar":
        setShowCalendar((prev) => !prev);
        break;
      case "playlist":
        setShowPlaylist((prev) => !prev);
        break;
      default:
        break;
    }
  };

  return (
    <div className="container w-100" style={{ marginLeft: "120px" }}>
      {" "}
      {/* Added margin */}
      <div className="row">
        <div className="col mt-2">{showNotes && <NotesApp />}</div>
        <div className="col mt-2">
          <div className="row">{showTimer && <Timer />}</div>
          <div className="row">{showPlaylist && <PlaylistPlayer />}</div>
        </div>
        <div className="col mt-3">
          <div className="row">{showTodo && <TodoApp />}</div>
        </div>
      </div>
      <BottomNavbar toggleComponent={toggleComponentVisibility} />
    </div>
  );
};

export default StudyPage;
