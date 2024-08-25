import React, { useState } from "react";
import axios from "axios";
import "./GenerateCard.css";

const GenerateCard = ({ fetchCards }) => {
  const [paragraph, setParagraph] = useState("");
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");

  const handleGenerateClick = async () => {
    if (!paragraph) {
      setSnackbarMessage("Paragraph is required.");
      setSnackbarType("error");
      setSnackbarVisible(true);
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/generatecard", { paragraph });

      // Fetch updated flashcards
      await fetchCards();

      setSnackbarMessage("Flashcard generated successfully!");
      setSnackbarType("success");
      setSnackbarVisible(true);
      setParagraph(""); // Reset paragraph input
    } catch (error) {
      console.error("Error generating flashcard:", error);
      setSnackbarMessage("Error generating flashcard");
      setSnackbarType("error");
      setSnackbarVisible(true);
    }
  };

  return (
    <div className="add-card-container">
      <div className="card-box">
        <h2 className="card-heading">Generate Flashcards</h2>
        <div className="input-group">
          <label htmlFor="paragraph-input">Paragraph</label>
          <textarea
            id="paragraph-input"
            placeholder="Enter the paragraph"
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
          />
        </div>
        <button className="add-button" onClick={handleGenerateClick}>
          Generate
        </button>
      </div>
      {snackbarVisible && (
        <div className={`snackbar ${snackbarType}`}>{snackbarMessage}</div>
      )}
    </div>
  );
};

export default GenerateCard;
