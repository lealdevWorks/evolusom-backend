const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Event = require("../models/Event");

// Rota para buscar categorias com seus eventos associados
router.get("/categories-with-events", async (req, res) => {
  try {
    const categories = await Category.find(); // Busca todas as categorias

    const categoriesWithEvents = await Promise.all(
      categories.map(async (category) => {
        const events = await Event.find({ category: category._id }); // Busca eventos por categoria
        return { ...category.toObject(), events }; // Retorna categoria com eventos
      })
    );

    res.status(200).json(categoriesWithEvents);
  } catch (error) {
    console.error("Erro ao buscar categorias com eventos:", error);
    res.status(500).json({ error: "Erro ao buscar categorias com eventos." });
  }
});

module.exports = router;
