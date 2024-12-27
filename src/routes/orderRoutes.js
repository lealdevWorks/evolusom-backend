const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Rota: Buscar todos os pedidos
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error.message);
    res.status(500).json({ error: 'Erro ao buscar pedidos.' });
  }
});

// Rota: Criar um novo pedido
router.post('/', async (req, res) => {
  try {
    console.log('Dados recebidos no backend:', req.body);

    const { nome, evento, data, cidade, local, tipo, itens } = req.body;

    if (!nome || !evento || !data || !cidade || !local || !tipo || !itens || itens.length === 0) {
      return res.status(400).json({ error: 'Todos os campos e itens do pedido são obrigatórios.' });
    }

    const newOrder = new Order({ nome, evento, data, cidade, local, tipo, itens });
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Erro ao criar pedido:', error.message);
    res.status(500).json({ error: error.message || 'Erro ao criar pedido.' });
  }
});

module.exports = router;
