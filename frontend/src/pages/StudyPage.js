import React, { useState } from "react";
import NotesApp from "../components/Notes";
import Timer from "../components/Timer";
import TodoApp from "../components/ToDo";
import CalendarComponent from "../components/Calendar";
import PlaylistPlayer from "../components/PlaylistPlayer";
import BottomNavbar from "../components/Navbar";

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
    <div>
      <div className="row">{showNotes && <NotesApp />}</div>
      <div className="row">{showTimer && <Timer />}</div>
      <div className="row">{showTodo && <TodoApp />}</div>
      <div className="row">{showCalendar && <CalendarComponent />}</div>
      <div className="row">{showPlaylist && <PlaylistPlayer />}</div>

      <div className="row">
        <BottomNavbar toggleComponent={toggleComponentVisibility} />
      </div>
    </div>
  );
};

export default StudyPage;
