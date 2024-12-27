const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true }, // Imagem circular associada à categoria
  },
  { timestamps: true } // Adiciona createdAt e updatedAt automaticamente
);

module.exports = mongoose.model("Category", CategorySchema);
