const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');

router.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Acesso permitido.', user: req.user });
});

module.exports = router;
