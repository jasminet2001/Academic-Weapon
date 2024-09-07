import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import StudyPage from "./pages/StudyPage";
import Chatbot from "./components/Chatbot";
import SignUp from "./components/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudyPage />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
