const express = require('express');
const router = express.Router();

// Array de carts
const carts = []

router.get('/cart', (req, res) => {
  // Lógica para mostrar el carrito de compras
});

router.post('/cart', (req, res) => {
  // Lógica para agregar un producto al carrito
});

module.exports = router;