import React, { useState } from "react";
import "./EditCard.css";

const EditCard = ({ cards, updateCard, deleteCard }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCard, setEditingCard] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success"); // success, error, warning

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCards = cards.filter((card) =>
    card.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditClick = (card) => {
    setEditingCard(card);
  };

  const handleDeleteClick = (id) => {
    deleteCard(id);
  };

  const handleModalClose = () => {
    setEditingCard(null);
  };

  const handleUpdateClick = () => {
    const { question, answer } = editingCard;

    if (!question && !answer) {
      setSnackbarMessage("Both fields are required.");
      setSnackbarType("error");
    } else if (!question) {
      setSnackbarMessage("Question is required.");
      setSnackbarType("warning");
    } else if (!answer) {
      setSnackbarMessage("Answer is required.");
      setSnackbarType("warning");
    } else {
      updateCard(editingCard);
      setSnackbarMessage("Flashcard updated successfully!");
      setSnackbarType("success");
      setEditingCard(null);
    }

    setSnackbarVisible(true);
    setTimeout(() => {
      setSnackbarVisible(false);
    }, 3000);
  };

  return (
    <div className="edit-card-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by question"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="cards-list">
        {filteredCards.map((card) => (
          <div key={card.id} className="card">
            <div className="card-content">
              <h3 className="card-title">{card.question}</h3>
              <p className="card-answer">{card.answer}</p>
              <div className="card-actions">
                <button
                  onClick={() => handleEditClick(card)}
                  className="edit-btn"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteClick(card.id)}
                  className="delete-btn"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editingCard && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Card</h2>
            <div className="input-group">
              <label htmlFor="modal-question">Question</label>
              <input
                type="text"
                id="modal-question"
                value={editingCard.question}
                onChange={(e) =>
                  setEditingCard({ ...editingCard, question: e.target.value })
                }
              />
            </div>
            <div className="input-group">
              <label htmlFor="modal-answer">Answer</label>
              <textarea
                id="modal-answer"
                value={editingCard.answer}
                onChange={(e) =>
                  setEditingCard({ ...editingCard, answer: e.target.value })
                }
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleModalClose} className="cancel-btn">
                Cancel
              </button>
              <button onClick={handleUpdateClick} className="update-btn">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      {snackbarVisible && (
        <div className={`snackbar ${snackbarType}`}>{snackbarMessage}</div>
      )}
    </div>
  );
};

export default EditCard;
