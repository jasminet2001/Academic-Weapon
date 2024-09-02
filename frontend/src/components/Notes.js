import React, { useState } from "react";

const NotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 2; // Number of notes to display per page

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

  // Pagination logic
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredAndSortedNotes.slice(
    indexOfFirstNote,
    indexOfLastNote
  );

  const totalPages = Math.ceil(filteredAndSortedNotes.length / notesPerPage);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`btn mx-1 ${
            currentPage === i ? "btn-primary" : "btn-outline-primary"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div
      className="container my-2 card"
      style={{ width: "22rem", height: "50rem", paddingTop: "2rem" }}
    >
      <div className="row justify-content-md-center card-title">
        <h2 className="text-center">Notes</h2>
      </div>

      <div className="row justify-content-md-left my-3">
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
            style={{ height: "10rem" }}
          />
        </div>
      </div>

      <div>
        <button
          onClick={handleAddNote}
          className="col-md-auto btn btn-outline-primary mx-1 my-3"
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

      <ul>
        {currentNotes.map((note, index) => (
          <li key={indexOfFirstNote + index}>
            <h3>{note.title}</h3>
            <p>{note.description}</p>
            <small className="mx-1">{note.date.toLocaleString()}</small>
            <button
              className="btn btn-sm btn-outline-secondary mx-1"
              onClick={() => handleEditNote(indexOfFirstNote + index)}
            >
              Edit
            </button>
            <button
              className="btn btn-sm btn-outline-danger mx-1"
              onClick={() => handleDeleteNote(indexOfFirstNote + index)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div
        className="pagination-controls text-center mb-2"
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
        }}
      >
        {renderPageNumbers()}
      </div>
    </div>
  );
};

export default NotesApp;
