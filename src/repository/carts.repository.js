const daoCarts = require('../dao/mongo/carts.dao.js');
const { ProductRepository } = require('./products.repository');

class CartRepository {

    #cartDao;
    #productRepository;

    constructor() {
        this.#cartDao = new CartDAO();
        this.#productRepository = new ProductRepository();
    }

    async #verifyCartExists(cartId) {
        const cart = await this.#cartDao.getCartById(cartId);
        if (!cart) {
            throw new Error('El carrito no existe.');
        }
        return cart;
    }

    async #verifyProductExists(productId) {
        const product = await this.#productRepository.getProductById(productId);
        if (!product) {
            throw new Error('El producto no existe.');
        }
        return product;
    }

    async getCarts() {
        try {
            return await this.#cartDao.getCarts();
        } catch (e) {
            throw new Error({ error: e.message });
        }
    }

    async getCartById(id) {
        try {
            let cart = await this.#cartDao.getCartById(id);
            await this.#verifyCartExists(id);
            // verificacion
            const updatedCart = cart.products.filter(i => i.product !== null);
            if (updatedCart.lenght !== cart.products.length) {
                cart.products = updatedCart;
                await this.#cartDao.updateCart(id, { products: cart.products })
            }
            return cart;
        } catch (e) {
            throw new Error({ error: e.message });
        }
    }

    async addCart() {
        try {

        } catch (e) {
            throw new Error({ error: e.message })
        }
        const cart = { porducts: [] }
        return await this.#cartDao.addCart(cart);

    }

    async addProductToCart(productId, cartId) {
        try {
            await this.#verifyProductExists(productId);
            const cart = await this.#verifyCartExists(cartId);

            // Verificar si el producto ya está en el carrito
            const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));
            if (existingProductIndex !== -1) {
                // Si el producto existe, aumentar su cantidad en 1
                cart.products[existingProductIndex].quantity += 1;
            } else {
                // Si el producto no existe, agregarlo al carrito con cantidad 1
                cart.products.push({ product: productId, quantity: 1 });
            }

            // Guardar el carrito actualizado
            console.log('Producto agregado al carrito correctamente');
            await this.#cartDao.updateCart(cartId, { products: cart.products });

            return cart;

        } catch (error) {
            console.error('Error en addProductToCart:', error);
            throw new Error('Hubo un error al agregar un producto al carrito.');
        }
    }

    async updateCart(cartId, products) {
        try {
            const cart = await this.#verifyCartExists(cartId);

            // Iterar sobre cada producto en el arreglo de productos
            for (const { product: productId, quantity } of products) {
                await this.#verifyProductExists(productId);

                // Verificar si el producto ya está en el carrito
                const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));
                if (existingProductIndex !== -1) {
                    // Si el producto ya está en el carrito, actualizar la cantidad
                    cart.products[existingProductIndex].quantity += quantity;
                } else {
                    // Si el producto no está en el carrito, agregarlo
                    cart.products.push({ product: productId, quantity });
                }
            }

            // Guardar los cambios en el carrito utilizando el DAO
            const updatedCart = await this.#cartDao.updateCart(cartId, { products: cart.products });

            console.log(`Se actualizó el carrito ${cartId}, ${updatedCart}`);
            return updatedCart;
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            throw new Error('Error al actualizar el carrito');
        }
    }

    async deleteProductFromCart(productId, cartId) {
        try {
            await this.#verifyProductExists(productId);
            const cart = this.#verifyCartExists(cartId);
            await this.#cartDao.updateCart(cartId, { products: { product: productId } });
            return cart;
        } catch (e) {
            throw new Error({ error: e.message })
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            await this.#verifyProductExists(productId);
            const cart = await this.#verifyCartExists(cartId);
            console.log(cart);

            const existingProductIndex = cart.products.findIndex(p => p.product.equals(productId));
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity = quantity;
                await this.#cartDao.updateCart(cartId, { products: cart.products });
            }
            return cart;
        } catch (e) {
            throw new Error({ error: e.message });
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await this.#verifyCartExists(cartId);
            await this.#cartDao.updateCart(cartId, { products: [] });
            return cart;

        } catch (e) {
            throw new Error({ error: e.message });
        }

    }
}

module.exports = { CartRepository };