import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import StudyPage from "./pages/StudyPage";
import Chatbot from "./components/Chatbot";
import SignUp from "./components/Signup";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./components/Login";
import CalendarApp from "./components/Calendar";
import EditProfile from "./components/Profile";
import WorkTimeChart from "./components/WorkTimeChart";
import FlashcardList from "./components/FlashCardList";

function App() {
  const clientId =
    "210279610391-c3510jlifbejjr6s755ckel75226ejc4.apps.googleusercontent.com";
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="/" element={<StudyPage />} />
          <Route path="/chat" element={<Chatbot />} />
          <Route path="/calendar" element={<CalendarApp />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/chart" element={<WorkTimeChart />} />
          <Route path="/cards" element={<FlashcardList />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
