import React, { useState } from "react";
import "./AddCard.css";

const AddCard = ({ addCard }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success"); // success, error, warning

  const handleAddClick = () => {
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
      const newCard = {
        id: Date.now(), // Use timestamp as a unique ID
        question,
        answer,
      };
      addCard(newCard);
      setQuestion("");
      setAnswer("");
      setSnackbarMessage("Flashcard added successfully!");
      setSnackbarType("success");
    }

    setSnackbarVisible(true);
    setTimeout(() => {
      setSnackbarVisible(false);
    }, 3000);
  };

  return (
    <div className="add-card-container">
      <div className="card-box">
        <h2 className="card-heading">Add Flashcards</h2>
        <div className="input-group">
          <label htmlFor="question-input">Question</label>
          <input
            type="text"
            id="question-input"
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="answer-input">Answer</label>
          <textarea
            id="answer-input"
            placeholder="Enter the answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
        <button className="add-button" onClick={handleAddClick}>
          Add
        </button>
      </div>
      {snackbarVisible && (
        <div className={`snackbar ${snackbarType}`}>{snackbarMessage}</div>
      )}
    </div>
  );
};

export default AddCard;
