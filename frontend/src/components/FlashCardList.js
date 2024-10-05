import React, { useState, useEffect } from "react";
import Flashcard from "./FlashCard";
import axios from "axios";
import BottomNavbar from "./Navbar";
import "../Cardslist.css";

const FlashcardList = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [newCard, setNewCard] = useState({
    front: "",
    back: "",
    category: "math",
  });
  const [editMode, setEditMode] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // New state for search term
  const token = localStorage.getItem("access_token");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    const response = await axios.get(
      "http://localhost:8000/api/accounts/cards/flashcards/",
      axiosConfig
    );
    setFlashcards(response.data);
  };

  const handleAddCard = async () => {
    if (newCard.front && newCard.back) {
      const response = await axios.post(
        "http://localhost:8000/api/accounts/cards/flashcards/",
        newCard,
        axiosConfig
      );
      setFlashcards([...flashcards, response.data]);
      setNewCard({ front: "", back: "", category: "math" }); // Clear input fields after adding
    }
  };

  const handleDeleteCard = async (id) => {
    await axios.delete(
      `http://localhost:8000/api/accounts/cards/flashcards/${id}/`,
      axiosConfig
    );
    setFlashcards(flashcards.filter((card) => card.id !== id));
  };

  const handleEditCard = (card) => {
    setEditMode(card);
    setNewCard({ front: card.front, back: card.back, category: card.category });
  };

  const handleSaveEdit = async () => {
    if (editMode) {
      const response = await axios.put(
        `http://localhost:8000/api/accounts/cards/flashcards/${editMode.id}/`,
        newCard,
        axiosConfig
      );
      setFlashcards(
        flashcards.map((card) =>
          card.id === editMode.id ? response.data : card
        )
      );
      setEditMode(null); // Exit edit mode
      setNewCard({ front: "", back: "", category: "math" }); // Clear input fields after saving
    }
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setNewCard({ front: "", back: "", category: "math" });
  };

  // Filter flashcards based on the search term
  const filteredFlashcards = flashcards.filter(
    (card) =>
      card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.back.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-3">
      <div className="row">
        <div className="add-flashcard-form p-3 card">
          <h3>{editMode ? "Edit Flashcard" : "Add New Flashcard"}</h3>
          <textarea
            className="form-control mt-4 mb-2"
            type="text"
            placeholder="Front"
            value={newCard.front}
            onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
          />
          <textarea
            className="form-control my-2"
            type="text"
            placeholder="Back"
            value={newCard.back}
            onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
          />
          <select
            className="form-control my-2"
            value={newCard.category}
            onChange={(e) =>
              setNewCard({ ...newCard, category: e.target.value })
            }
          >
            <option value="math">Math</option>
            <option value="science">Science</option>
            <option value="english">English</option>
          </select>
          {editMode ? (
            <div>
              <button
                className="btn btn-primary mx-1 my-1"
                onClick={handleSaveEdit}
              >
                Save
              </button>
              <button className="btn btn-primary" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          ) : (
            <button className="btn btn-primary my-2" onClick={handleAddCard}>
              Add Card
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="row justify-content-center mt-2">
        <input
          type="text"
          placeholder="Search cards..."
          className="form-control w-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Flashcards List */}
      <div className="row scroll-container g-3 justify-content-center my-1">
        {filteredFlashcards.length > 0 ? (
          filteredFlashcards.map((card) => (
            <Flashcard
              className="col col-md-3"
              key={card.id}
              front={card.front}
              back={card.back}
              category={card.category} // Passing category to Flashcard component
              onDelete={() => handleDeleteCard(card.id)}
              onEdit={() => handleEditCard(card)}
            />
          ))
        ) : (
          <p className="text-center">No cards found</p>
        )}
      </div>

      <BottomNavbar />
    </div>
  );
};

export default FlashcardList;
