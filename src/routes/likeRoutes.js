const express = require("express");
const router = express.Router();
const Like = require("../models/Like");
const Event = require("../models/Event");

// Criar uma nova curtida
router.post("/:eventId/likes", async (req, res) => {
  try {
    const { user, emoji } = req.body;
    const { eventId } = req.params;

    if (!user || !emoji) {
      return res.status(400).json({ error: "Usuário e emoji são obrigatórios." });
    }

    // Verificar se o evento existe
    const eventExists = await Event.exists({ _id: eventId });
    if (!eventExists) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }

    // Verificar se o usuário já curtiu o evento
    const existingLike = await Like.findOne({ eventId, user });
    if (existingLike) {
      return res.status(400).json({ error: "Você já curtiu este evento." });
    }

    const like = new Like({ eventId, user, emoji });
    await like.save();

    res.status(201).json(like);
  } catch (error) {
    console.error("Erro ao criar curtida:", error.message);
    res.status(500).json({ error: "Erro ao criar curtida." });
  }
});

// Listar todas as curtidas de um evento
router.get("/:eventId/likes", async (req, res) => {
  try {
    const { eventId } = req.params;

    // Verificar se o evento existe
    const eventExists = await Event.exists({ _id: eventId });
    if (!eventExists) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }

    const likes = await Like.find({ eventId })
      .select("user emoji timestamp")
      .sort({ timestamp: -1 });
    res.status(200).json(likes);
  } catch (error) {
    console.error("Erro ao buscar curtidas:", error.message);
    res.status(500).json({ error: "Erro ao buscar curtidas." });
  }
});

// Atualizar uma reação existente
router.patch("/:eventId/likes", async (req, res) => {
  try {
    const { user, emoji } = req.body;
    const { eventId } = req.params;

    if (!user || !emoji) {
      return res.status(400).json({ error: "Usuário e emoji são obrigatórios." });
    }

    // Verificar se o evento existe
    const eventExists = await Event.exists({ _id: eventId });
    if (!eventExists) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }

    // Atualizar a reação do usuário
    const like = await Like.findOneAndUpdate(
      { eventId, user },
      { emoji },
      { new: true } // Retorna o documento atualizado
    );

    if (!like) {
      return res.status(404).json({ error: "Reação não encontrada." });
    }

    res.status(200).json({ message: "Reação atualizada com sucesso.", like });
  } catch (error) {
    console.error("Erro ao atualizar reação:", error.message);
    res.status(500).json({ error: "Erro ao atualizar reação." });
  }
});

// Remover uma curtida existente
router.delete("/:eventId/likes", async (req, res) => {
  try {
    const { user } = req.body;
    const { eventId } = req.params;

    if (!user) {
      return res.status(400).json({ error: "Usuário é obrigatório." });
    }

    // Verificar se o evento existe
    const eventExists = await Event.exists({ _id: eventId });
    if (!eventExists) {
      return res.status(404).json({ error: "Evento não encontrado." });
    }

    // Remover a curtida
    const like = await Like.findOneAndDelete({ eventId, user });
    if (!like) {
      return res.status(404).json({ error: "Curtida não encontrada." });
    }

    res.status(200).json({ message: "Curtida removida com sucesso." });
  } catch (error) {
    console.error("Erro ao remover curtida:", error.message);
    res.status(500).json({ error: "Erro ao remover curtida." });
  }
});

module.exports = router;
