// backend\src\routes\eventRoutes.js
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// Criar um evento
router.post("/", async (req, res) => {
  try {
    const { name, category, description, images, local, date } = req.body;

    // Validação: verificar se todos os campos exigidos estão presentes
    if (!name || !category || !description || !images || images.length === 0 || !date) {
      return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });
    }

    // Validar se 'date' é uma data válida
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({ error: "Data do evento inválida." });
    }

    const newEvent = new Event({ name, category, description, images, local, date: eventDate });
    const savedEvent = await newEvent.save();
    return res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return res.status(500).json({ error: "Erro ao criar evento." });
  }
});

// Obter todos os eventos
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().populate("category", "name"); // Popula o nome da categoria
    res.status(200).json(events);
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    res.status(500).json({ error: "Erro ao buscar eventos." });
  }
});

// Deletar um evento
router.delete("/:id", async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ error: "Evento não encontrado." });
    res.status(200).json({ message: "Evento deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir evento:", error);
    res.status(500).json({ error: "Erro ao excluir evento." });
  }
});

module.exports = router;
