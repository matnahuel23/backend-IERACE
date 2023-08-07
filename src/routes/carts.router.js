const express = require('express');
const router = express.Router();

// Array de carts
const carts = []

// Ruta para obtener todos los carritos
router.get('/api/carts', (req, res) => {
  res.json({ carts })
});

// Ruta para obtener un carrito específico por ID
router.get('/api/carts/:pid', (req, res) => {
  const pid = parseInt(req.params.pid);
  const cart = carts.find((cart) => cart.id === pid);
  if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado.' })
  }
  return res.json(cart);
})

function generateUniqueId() {
  return Date.now().toString();
} 
router.post('/api/carts', (req, res) => {

  carts.push(newCarts);
  res.json({ message: 'Carrito agregado correctamente.', product: newProduct });
});

module.exports = router;