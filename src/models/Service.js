const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    coverImage: { type: String, required: true },
    additionalImages: { type: [String], default: [] },
  },
  { timestamps: true } // Adiciona createdAt e updatedAt automaticamente
);

module.exports = mongoose.model("Service", ServiceSchema);
