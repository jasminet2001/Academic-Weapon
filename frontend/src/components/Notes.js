import React, { useState, useEffect } from "react";
import "../notes.css";
import axios from "axios";

const NotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch notes when the component is mounted
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const accessToken = localStorage.getItem("access_token"); // Retrieve JWT from localStorage

      const response = await axios.get(
        "http://localhost:8000/api/accounts/notes/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Include the token in the headers
          },
        }
      );

      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleAddNote = async () => {
    if (newTitle.trim() && newDescription.trim()) {
      const newNote = {
        title: newTitle,
        description: newDescription,
      };

      try {
        const accessToken = localStorage.getItem("access_token");

        if (isEditing && currentNoteId !== null) {
          // Update an existing note
          await axios.put(
            `http://localhost:8000/api/accounts/notes/${currentNoteId}/`,
            newNote,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        } else {
          // Add a new note
          await axios.post(
            "http://localhost:8000/api/accounts/notes/",
            newNote,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        }

        fetchNotes(); // Refresh the notes list
        setNewTitle("");
        setNewDescription("");
        setIsEditing(false);
        setCurrentNoteId(null);
      } catch (error) {
        console.error("Error saving note:", error);
      }
    }
  };

  const handleEditNote = (note) => {
    setCurrentNoteId(note.id);
    setNewTitle(note.title);
    setNewDescription(note.description);
    setIsEditing(true);
  };

  const handleDeleteNote = async (id) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:8000/api/accounts/notes/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      fetchNotes(); // Refresh the notes list after deletion
    } catch (error) {
      console.error("Error deleting note:", error);
    }
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
                {/* Use optional chaining and provide a fallback */}
                <small className="mx-1">
                  {note.date
                    ? new Date(note.date).toLocaleString()
                    : "No Date Available"}
                </small>
                <div className="row my-1 justify-content-center">
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleEditNote(note)} // pass the note instead of index
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteNote(note.id)} // pass the note id for deletion
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
