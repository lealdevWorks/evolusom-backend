const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  user: { type: String, required: true },
  emoji: { type: String, required: true }, // Campo para armazenar o emoji usado
  timestamp: { type: Date, default: Date.now },
});

// Índice único para evitar que o mesmo usuário curta o mesmo evento mais de uma vez
LikeSchema.index({ eventId: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Like", LikeSchema);
