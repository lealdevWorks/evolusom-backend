const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Carregar credenciais do .env
const { ADMIN_EMAIL, ADMIN_PASSWORD_HASH, SECRET_KEY } = process.env;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH || !SECRET_KEY) {
  console.error('❌ Erro: As variáveis de ambiente não estão definidas corretamente.');
  process.exit(1);
}

// Middleware para limitar tamanho do JSON e URL-encoded
router.use(express.json({ limit: '10mb' }));
router.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rota de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Tentativa de login recebida:', { email });

  if (!email || !password) {
    console.error('❌ Email ou senha ausentes.');
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    if (email !== ADMIN_EMAIL) {
      console.error('❌ Email incorreto:', email);
      return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }

    const validPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!validPassword) {
      console.error('❌ Senha incorreta.');
      return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
    }

    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
    console.log('✅ Login bem-sucedido. Token gerado.');

    res.status(200).json({ token });
  } catch (error) {
    console.error('❌ Erro ao processar o login:', error.message);
    res.status(500).json({ error: 'Erro no servidor. Tente novamente mais tarde.' });
  }
});

// Rota para verificar validade do token
router.get('/validate', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Token ausente.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.status(200).json({ valid: true, email: decoded.email });
  } catch (error) {
    console.error('Token inválido:', error.message);
    res.status(401).json({ error: 'Sessão expirada ou inválida.' });
  }
});

module.exports = router;
