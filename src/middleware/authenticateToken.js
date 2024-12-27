const jwt = require('jsonwebtoken');

// Middleware para validar o token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrai o token do cabeçalho Authorization

  if (!token) {
    return res.status(401).json({ error: 'Token ausente. Faça login novamente.' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado. Faça login novamente.' });
    }
    req.user = user; // Anexa os dados do usuário ao request
    next();
  });
};

module.exports = authenticateToken;
