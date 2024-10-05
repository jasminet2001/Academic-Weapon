import React, { useState } from "react";
import axios from "axios";
import BottomNavbar from "./Navbar";
import "../chat.css";
const ChatBot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedInput = `The answer to the problem is [MASK].`;
    const response = await query({ inputs: formattedInput });

    const botResponse =
      Array.isArray(response) && response.length > 0
        ? response[0].sequence
        : "I'm sorry, I couldn't find an answer.";

    setChatHistory([...chatHistory, { user: userInput, bot: botResponse }]);
    setUserInput("");
    setLoading(false);
  };

  const query = async (payload) => {
    const API_URL =
      "https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased";
    const headers = {
      Authorization: `Bearer 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`,
    }; // Replace with your API key

    try {
      const res = await axios.post(API_URL, payload, { headers });
      return res.data; // Return the response data
    } catch (error) {
      console.error(
        "Error fetching data from Hugging Face:",
        error.response ? error.response.data : error.message
      );
      return "I'm sorry, there was an error processing your request.";
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        {" "}
        <div className="card main-card p-4">
          {" "}
          <div className="row">
            {" "}
            <h1>AI Chat Bot</h1>
          </div>
          <div className="row my-4">
            {" "}
            <form onSubmit={handleSubmit}>
              <div className="col">
                {" "}
                <input
                  className="form-control"
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  placeholder="Ask me a question..."
                />
              </div>
              <div className="col">
                {" "}
                <button className="btn btn-primary my-2" type="submit">
                  Send
                </button>
              </div>
            </form>
          </div>
          <div className="chat-history">
            {chatHistory.map((chat, index) => (
              <div key={index}>
                <strong>You:</strong> {chat.user}
                <br />
                <strong>Bot:</strong> {loading ? "..." : chat.bot}
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
};

export default ChatBot;
