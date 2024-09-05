import React, { useState } from "react";
import NotesApp from "../components/Notes";
import Timer from "../components/Timer";
import TodoApp from "../components/ToDo";
import CalendarComponent from "../components/Calendar";
import PlaylistPlayer from "../components/PlaylistPlayer";

const StudyPage = () => {
  return (
    <div>
      <div class="row">
        <NotesApp />
      </div>
      <div class="row">
        <Timer />
      </div>
      <div className="row">
        <TodoApp />
      </div>
      <div className="row">
        <CalendarComponent />
      </div>
      <div className="row">
        <PlaylistPlayer />
      </div>
    </div>
  );
};

export default StudyPage;
