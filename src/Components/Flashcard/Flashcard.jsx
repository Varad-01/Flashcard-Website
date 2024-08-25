import React, { useState, useEffect } from "react";
import "./Flashcard.css";

const Flashcard = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch flashcards when the component mounts
    const fetchCards = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/flashcards");
        const data = await response.json();
        if (data.length > 0) {
          setCards(data);
          setCurrentIndex(0); // Set to the first card if there are cards available
        } else {
          setCards([]);
          setCurrentIndex(-1); // No flashcards available
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
        setCards([]);
        setCurrentIndex(-1); // Error fetching flashcards
      }
    };

    fetchCards();
  }, []);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextClick = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false); // Reset flip state when changing card
    }
  };

  const handlePrevClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false); // Reset flip state when changing card
    }
  };

  const displayCard = cards[currentIndex] || {
    question: "No Flashcards Available",
    answer: "Please add new flashcards to get started.",
  };

  return (
    <div className="flashcard-container" onClick={handleCardClick}>
      <div className={`flashcard ${isFlipped ? "flipped" : ""}`}>
        <div className="question">
          <div className="content">{displayCard.question}</div>
        </div>
        <div className="answer">
          <div className="content">{displayCard.answer}</div>
        </div>
      </div>
      <button
        className="next-button"
        onClick={(e) => {
          e.stopPropagation();
          handleNextClick();
        }}
        disabled={currentIndex >= cards.length - 1} // Disable button if at the last card
      >
        Next
      </button>
      <button
        className="previous-button"
        onClick={(e) => {
          e.stopPropagation();
          handlePrevClick();
        }}
        disabled={currentIndex <= 0} // Disable button if at the first card
      >
        Previous
      </button>
    </div>
  );
};

export default Flashcard;
