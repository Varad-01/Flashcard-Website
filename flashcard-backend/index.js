const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Add this line

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Get all flashcards
app.get("/api/flashcards", async (req, res) => {
  try {
    const flashcards = await prisma.flashcards.findMany();
    res.json(flashcards);
  } catch (err) {
    console.error("Error fetching flashcards:", err);
    res.status(500).json({ message: "Error fetching flashcards" });
  }
});

// Add a new flashcard
app.post("/api/flashcards", async (req, res) => {
  const { question, answer } = req.body;
  try {
    const newFlashcard = await prisma.flashcards.create({
      data: { question, answer },
    });
    res.json(newFlashcard);
  } catch (err) {
    console.error("Error adding flashcard:", err);
    res.status(500).json({ message: "Error adding flashcard" });
  }
});

// Update a flashcard
app.put("/api/flashcards/:id", async (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  try {
    const updatedFlashcard = await prisma.flashcards.update({
      where: { id: Number(id) },
      data: { question, answer },
    });
    res.json(updatedFlashcard);
  } catch (err) {
    console.error("Error updating flashcard:", err);
    if (err.code === "P2025") {
      res.status(404).json({ message: "Flashcard not found" });
    } else {
      res.status(500).json({ message: "Error updating flashcard" });
    }
  }
});

// Delete a flashcard
app.delete("/api/flashcards/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedFlashcard = await prisma.flashcards.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Flashcard deleted successfully", deletedFlashcard });
  } catch (err) {
    console.error("Error deleting flashcard:", err);
    if (err.code === "P2025") {
      res.status(404).json({ message: "Flashcard not found" });
    } else {
      res.status(500).json({ message: "Error deleting flashcard" });
    }
  }
});

// Generate a flashcard using Gemini AI
app.post("/api/generatecard", async (req, res) => {
  const { paragraph } = req.body;

  if (!paragraph) {
    return res.status(400).json({ message: "Paragraph is required" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Please generate a response based on the following paragraph, limiting the response to at most 15 words:\n\n${paragraph}`;

    const result = await model.generateContent(prompt);

    const answer = result.response.text();

    const newFlashcard = await prisma.flashcards.create({
      data: {
        question: paragraph,
        answer: answer,
      },
    });

    res.json(newFlashcard);
  } catch (error) {
    console.error("Error generating flashcard:", error);
    res.status(500).json({ message: "Error generating flashcard" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
