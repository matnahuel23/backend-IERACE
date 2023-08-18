const express = require('express');
const router = express.Router();
const Contenedor = require('../manager/contenedor')
const contenedor = new Contenedor('../data/carts.json')
const productsContenedor = new Contenedor('../data/products.json');
const path = require('path');
const { Console } = require('console');

// Array de carritos
const cart = []

// Ruta para obtener todos los carritos
router.get('/api/cart', async (req, res) => {
    try {
        const carts = await contenedor.getAll();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los carritos.' });
    }
});

// Ruta para obtener un carrito por id
router.get('/api/cart/:pid', async (req, res) => {
    try {
        const pid = req.params.pid;
        const cart = await contenedor.getById(pid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado.' });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito.' });
    }
});

// Ruta para agregar un nuevo carrito
router.post('/api/cart', async (req, res) => {
    try {
        const newCart = {
            products : [],
        }    
        const newCartId = await contenedor.save(newCart);  // El ID se generará automáticamente en la función save
        res.json({ message: 'Carrito agregado correctamente.', product: { id: newCartId, ...newCart } });
    } catch (error) {
    res.status(500).json({ error: 'Error al agregar el carrito.' });
}
});

// Ruta para agregar uno o varios productos a un carrito existente
router.post('/api/cart/:cid/product/:pid', async (req, res) => {
    try {
         const cid = req.params.cid;
         const pid = req.params.pid;
         const { quantity } = req.body;
         const products = await productsContenedor.getAll();
         if (quantity <= 0) {
             return res.status(400).json({ error: 'Debe ingresar al menos una unidad del producto.' });
         }
         // Verificamos si el carrito existe
         const cartAdd = await contenedor.getById(cid);
         if (!cartAdd) {
             return res.status(404).json({ error: 'Carrito no encontrado.' });
         }
         // Verificamos si el producto existe
         const product = products.find((product) => product.id === pid);
         if (!product) {
             return res.status(404).json({ error: 'Producto no encontrado.' });
         }
         // Verifico que la cantidad no sea mayor al stock
        if (product.stock < quantity) {
            return res.status(404).json({ error: 'No disponemos de ese stock.' });
        }
         // Buscamos el producto existente en el carrito
         const existingProductIndex = cartAdd.products.findIndex((item) => item.pId === pid);
        if (existingProductIndex !== -1) {
            // Actualizamos la cantidad del producto existente
            cartAdd.products[existingProductIndex].quantity += quantity || 1;
        } else {
            // Agregamos el nuevo producto al arreglo "products" del carrito con la cantidad
            cartAdd.products.push({ pId: pid, quantity: quantity || 1 });
        }
        // Guardamos el carrito actualizado
        await contenedor.save(cartAdd);
        // Actualizo el stock del producto
        product.stock -= quantity;
        // Guardamos el producto con el stock actualizado
        await productsContenedor.save(product);
        return res.json({ message: 'Producto agregado al carrito correctamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto.' });
    }
});
 
//exporto el router
module.exports = {router};