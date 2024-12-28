const dotenv = require("dotenv");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Desestruturar as variáveis de ambiente
const { MONGO_URI, PORT } = process.env;

// Validar as variáveis de ambiente
if (!MONGO_URI || !PORT) {
  console.error("❌ Variáveis de ambiente ausentes. Verifique o arquivo .env.");
  process.exit(1);
}

// Configuração do Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Aumentar o limite de JSON
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Para dados de formulários

// Conectar ao MongoDB
const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado ao MongoDB");
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB:", err.message);
    process.exit(1);
  }
};

// Conectar ao banco de dados
connectMongoDB();

// Registrar as rotas (sem alteração na estrutura original)
const registerRoutes = () => {
  try {
    const authRoutes = require("./routes/authRoutes");
    const serviceRoutes = require("./routes/serviceRoutes");
    const orderRoutes = require("./routes/orderRoutes");
    const eventRoutes = require("./routes/eventRoutes");
    const categoryRoutes = require("./routes/categoryRoutes");

    // Registrar rotas
    app.use("/api/auth", authRoutes);
    app.use("/api/services", serviceRoutes);
    app.use("/api/orders", orderRoutes);
    app.use("/api/events", eventRoutes);
    app.use("/api/categories", categoryRoutes);

    // Rotas de comentários e curtidas
    app.use("/api/comments", commentRoutes);
    app.use("/api/likes", likeRoutes);
  } catch (err) {
    console.error("❌ Erro ao registrar rotas:", err.message);
    process.exit(1);
  }
};

registerRoutes();

// Rota de verificação da API
app.get("/", (req, res) => res.status(200).json({ message: "API funcionando!" }));

// Middleware para rotas inexistentes
app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

// Tratamento global de erros
app.use((err, req, res, next) => {
  console.error("❌ Erro no servidor:", err.stack);
  res.status(500).json({ error: "Erro interno do servidor." });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
