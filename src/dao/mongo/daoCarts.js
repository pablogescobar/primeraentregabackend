// src/dao/mongo/daoCarts.js
const { ObjectId } = require('mongodb');
const { Carts } = require('../../models');  // Asegúrate de que el modelo de Carts esté correctamente definido en models

class CartDAO {
    async addCart(cart) {
        try {
            const newCart = new Carts(cart);
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error('Error al agregar el carrito:', error);
            throw new Error('Error al agregar el carrito');
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await Carts.findById(cartId);
            return cart;
        } catch (error) {
            console.error('Error al obtener el carrito:', error);
            throw new Error('Error al obtener el carrito');
        }
    }

    async updateCart(cartId, updateData) {
        try {
            const updatedCart = await Carts.findByIdAndUpdate(cartId, updateData, { new: true });
            return updatedCart;
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            throw new Error('Error al actualizar el carrito');
        }
    }

    async deleteCartById(cartId) {
        try {
            await Carts.findByIdAndDelete(cartId);
        } catch (error) {
            console.error('Error al eliminar el carrito:', error);
            throw new Error('Error al eliminar el carrito');
        }
    }

    async addItemToCart(cartId, item) {
        try {
            const cart = await this.getCartById(cartId);
            cart.products.push(item);
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al agregar el producto al carrito:', error);
            throw new Error('Error al agregar el producto al carrito');
        }
    }

    async removeItemFromCart(cartId, itemId) {
        try {
            const cart = await this.getCartById(cartId);
            cart.products = cart.products.filter(product => product._id.toString() !== itemId);
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
            throw new Error('Error al eliminar el producto del carrito');
        }
    }
}

module.exports = CartDAO;
