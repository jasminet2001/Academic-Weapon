import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import StudyPage from "./pages/StudyPage";
// import Timer from './components/Timer';
// import NotesApp from './components/Notes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
