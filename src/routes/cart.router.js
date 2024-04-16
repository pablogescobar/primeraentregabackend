const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel');

// Endpoint para obtener los detalles de un carrito
router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId).populate('products.productId');
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para eliminar un producto de un carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        // Implementa la lógica para eliminar el producto del carrito
        res.status(200).json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para actualizar un carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productsArray = req.body.products;
        // Implementa la lógica para actualizar el carrito con el arreglo de productos
        res.status(200).json({ message: 'Carrito actualizado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para actualizar la cantidad de ejemplares de un producto en un carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        // Implementa la lógica para actualizar la cantidad de ejemplares del producto en el carrito
        res.status(200).json({ message: 'Cantidad de producto actualizada en el carrito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para eliminar todos los productos de un carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        // Implementa la lógica para eliminar todos los productos del carrito
        res.status(200).json({ message: 'Productos eliminados del carrito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
