import React, { useState } from "react";
import "../notes.css";

const NotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddNote = () => {
    if (newTitle.trim() && newDescription.trim()) {
      const newNote = {
        title: newTitle,
        description: newDescription,
        date: new Date(), // Add current date
      };

      if (isEditing && currentNoteIndex !== null) {
        const updatedNotes = notes.map((note, index) =>
          index === currentNoteIndex ? newNote : note
        );
        setNotes(updatedNotes);
        setIsEditing(false);
        setCurrentNoteIndex(null);
      } else {
        setNotes([...notes, newNote]);
      }

      setNewTitle("");
      setNewDescription("");
    }
  };

  const handleEditNote = (index) => {
    setCurrentNoteIndex(index);
    setNewTitle(notes[index].title);
    setNewDescription(notes[index].description);
    setIsEditing(true);
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setNewDescription(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter and sort notes by date
  const filteredAndSortedNotes = notes
    .filter(
      (note) =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.date - a.date); // Sort by date, latest first

  return (
    <div className="app">
      <div
        className="container my-2 card shadow-lg p-4 mb-5 bg-body"
        style={{ width: "17rem", paddingTop: "2rem" }}
      >
        <div className="row justify-content-md-center card-title">
          <h2 className="text-center">Notes</h2>
        </div>

        <div className="row justify-content-md-left my-1">
          <div className="col-md-auto">
            <input
              type="text"
              value={newTitle}
              onChange={handleTitleChange}
              placeholder="Note Title"
              className="form-control"
            />
          </div>
        </div>

        <div className="row justify-content-md-center my-3">
          <div className="col-lg">
            <textarea
              value={newDescription}
              onChange={handleDescriptionChange}
              placeholder="Note Description"
              className="form-control"
              style={{ height: "5rem" }}
            />
          </div>
        </div>

        <div>
          <button
            onClick={handleAddNote}
            className="col-md-auto btn btn-outline-primary mx-1"
          >
            {isEditing ? "Update Note" : "Add Note"}
          </button>
        </div>

        <div className="row justify-content-md-left my-3">
          <div className="col-md-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search notes..."
              className="form-control"
            />
          </div>
        </div>

        {/* Scrollable Notes List */}
        <div className="notes-container">
          <ul className="d-flex flex-column align-items-center p-0">
            {filteredAndSortedNotes.map((note, index) => (
              <li key={index} className="card p-2 my-1 notes-li">
                <h3>{note.title}</h3>
                <p className="description">{note.description}</p>
                <hr />
                <small className="mx-1">{note.date.toLocaleString()}</small>
                <div className="row my-1 justify-content-center">
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleEditNote(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteNote(index)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotesApp;
