const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

router.get("/:eventId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ eventId: req.params.eventId }).sort({ createdAt: -1 });
    const formattedComments = comments.map((comment) => ({
      id: comment._id, // Renomeando _id para id
      user: comment.user,
      text: comment.text,
      createdAt: comment.createdAt,
      eventId: comment.eventId,
    }));
    res.status(200).json(formattedComments);
  } catch (error) {
    console.error("Erro ao buscar comentários:", error.message);
    res.status(500).json({ error: "Erro ao buscar comentários." });
  }
});

// Adicionar um comentário
router.post("/:eventId/comments", async (req, res) => {
  const { user, text } = req.body;

  console.log("Dados recebidos:", { user, text, eventId: req.params.eventId });

  // Validação dos campos obrigatórios
  if (!text || !user) {
    console.error("Erro: Campos obrigatórios ausentes.");
    return res.status(400).json({ error: "O conteúdo e o usuário do comentário são obrigatórios." });
  }

  try {
    const comment = new Comment({
      user,
      text,
      eventId: req.params.eventId,
    });

    const savedComment = await comment.save();
    console.log("Comentário salvo com sucesso:", savedComment);
    res.status(201).json(savedComment);
  } catch (error) {
    console.error("Erro ao salvar comentário:", error.message);
    res.status(500).json({ error: "Erro ao salvar comentário." });
  }
});

// Editar um comentário
router.put("/:commentId", async (req, res) => {
  const { text } = req.body;

  // Validação do conteúdo do comentário
  if (!text) {
    return res.status(400).json({ error: "O conteúdo do comentário é obrigatório." });
  }

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      { text },
      { new: true } // Retorna o documento atualizado
    );

    if (!updatedComment) {
      return res.status(404).json({ error: "Comentário não encontrado." });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Erro ao atualizar comentário:", error.message);
    res.status(500).json({ error: "Erro ao atualizar comentário." });
  }
});

// Deletar um comentário
router.delete("/:commentId", async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);

    if (!deletedComment) {
      return res.status(404).json({ error: "Comentário não encontrado." });
    }

    console.log("Comentário excluído com sucesso:", deletedComment);
    res.status(200).json({ message: "Comentário excluído com sucesso.", deletedComment });
  } catch (error) {
    console.error("Erro ao excluir comentário:", error.message);
    res.status(500).json({ error: "Erro ao excluir comentário." });
  }
});

module.exports = router;
