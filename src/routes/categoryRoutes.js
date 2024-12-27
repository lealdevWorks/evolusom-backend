const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Event = require("../models/Event");

// Criar uma nova categoria
router.post("/", async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name || !image) {
      return res.status(400).json({ error: "Nome e imagem são obrigatórios." });
    }
    const category = new Category({ name, image });
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Erro ao criar categoria:", error.message);
    res.status(500).json({ error: "Erro ao criar categoria." });
  }
});

// Obter todas as categorias
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error.message);
    res.status(500).json({ error: "Erro ao buscar categorias." });
  }
});

// Deletar uma categoria
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }
    res.status(200).json({ message: "Categoria excluída com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir categoria:", error.message);
    res.status(500).json({ error: "Erro ao excluir categoria." });
  }
});

// Buscar categorias com eventos associados
router.get("/with-events", async (req, res) => {
  try {
    const categories = await Category.find();
    const categoriesWithEvents = await Promise.all(
      categories.map(async (category) => {
        const events = await Event.find({ category: category._id });
        return { ...category.toObject(), events };
      })
    );
    res.status(200).json(categoriesWithEvents);
  } catch (error) {
    console.error("Erro ao buscar categorias com eventos:", error);
    res.status(500).json({ error: "Erro ao buscar categorias com eventos." });
  }
});

module.exports = router;
