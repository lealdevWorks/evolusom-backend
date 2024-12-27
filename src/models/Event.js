// backend\src\models\Event.js
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true }, // Referência a Category
    description: { type: String, required: true },
    images: { type: [String], required: true }, // Lista de URLs das imagens do evento
    local: { type: String }, // Campo opcional para localização do evento
    date: { type: Date, required: true }, // Campo para data do evento
  },
  { timestamps: true } // Adiciona createdAt e updatedAt automaticamente
);

module.exports = mongoose.model("Event", EventSchema);
