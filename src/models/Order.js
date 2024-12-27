const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  evento: { type: String, required: true },
  data: { type: String, required: true },
  cidade: { type: String, required: true },
  local: { type: String, required: true },
  tipo: { type: String, required: true },
  itens: [
    {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String, default: "" }, 
      coverImage: { type: String, default: "" }, 
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
