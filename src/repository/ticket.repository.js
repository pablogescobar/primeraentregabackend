const TicketDAO = require('../dao/mongo/ticket.dao');
const CartDAO = require('../dao/mongo/carts.dao');
const ProductDAO = require('../dao/mongo/products.dao');

class TicketRepository {
    #ticketDAO
    #cartDAO
    #productDAO

    constructor() {
        this.#ticketDAO = new TicketDAO();
        this.#cartDAO = new CartDAO();
        this.#productDAO = new ProductDAO();
    }

    #generateUniqueCode() {
        return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    }

    async generateTicket(cartId, userEmail) {
        const cart = await this.#cartDAO.getCartById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');

        let totalAmount = 0;

        for (const item of cart.products) {
            const product = await this.#productDAO.getProductById(item.product);
            if (product.stock < item.quantity) {
                throw new Error(`No hay suficiente stock para el producto con ID ${product._id}`);
            }
        }

        for (const item of cart.products) {
            const product = await this.#productDAO.getProductById(item.product);
            product.stock -= item.quantity;
            totalAmount += product.price * item.quantity;
            await this.#productDAO.updateProduct(product._id, { stock: product.stock });
        }

        const ticketData = {
            code: this.#generateUniqueCode(),
            amount: totalAmount,
            purchaser: userEmail
        };

        const ticket = await this.#ticketDAO.addTicket(ticketData);

        await this.#cartDAO.clearCart(cartId);

        return ticket;
    }
}

module.exports = { TicketRepository };