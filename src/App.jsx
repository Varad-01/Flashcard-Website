import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import AddCard from "./Components/AddCard/AddCard";
import EditCard from "./Components/EditCard/EditCard";
import Flashcard from "./Components/Flashcard/Flashcard";
import GenerateCard from "./Components/GenerateCard/GenerateCard";

const App = () => {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const fetchCards = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/flashcards");
      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error("Error fetching flashcards:", error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const addCard = async (card) => {
    try {
      const response = await fetch("http://localhost:5000/api/flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(card),
      });
      const newCard = await response.json();
      setCards([...cards, newCard]);
    } catch (error) {
      console.error("Error adding flashcard:", error);
    }
  };

  const deleteCard = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/flashcards/${id}`, {
        method: "DELETE",
      });
      setCards(cards.filter((card) => card.id !== id));
    } catch (error) {
      console.error("Error deleting flashcard:", error);
    }
  };

  const updateCard = async (updatedCard) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/flashcards/${updatedCard.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCard),
        }
      );
      const data = await response.json();
      setCards(cards.map((card) => (card.id === data.id ? data : card)));
    } catch (error) {
      console.error("Error updating flashcard:", error);
    }
  };

  const nextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentCardIndex(
      (prevIndex) => (prevIndex - 1 + cards.length) % cards.length
    );
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Flashcard
              card={cards[currentCardIndex]}
              onNext={nextCard}
              onPrev={prevCard}
            />
          }
        />
        <Route path="/add-card" element={<AddCard addCard={addCard} />} />
        <Route
          path="/edit-card"
          element={
            <EditCard
              cards={cards}
              updateCard={updateCard}
              deleteCard={deleteCard}
            />
          }
        />
        <Route
          path="/generate-card"
          element={<GenerateCard fetchCards={fetchCards} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
