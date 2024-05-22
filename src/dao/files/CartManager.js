const fs = require('fs');
const ProductManager = require('./ProductManager');
const manager = new ProductManager(`${__dirname}/../../../assets/products.json`);

class CartManager {
    #carts;
    #lastCartId;
    path;

    constructor(path) {
        this.#carts = [];
        this.path = path;
        this.#lastCartId = 1;
        this.#readFile();
    }

    // leer el archivo con los carritos de manera similar que en ProductManager
    async #readFile() {
        try {
            const fileData = await fs.promises.readFile(this.path, 'utf-8');
            this.#carts = JSON.parse(fileData);
            this.#updateLastCartId();
        } catch (error) {
            await this.#saveFile();
        }
    }

    // actualizar el último ID de carrito de manera similar que en ProductManager
    #updateLastCartId() {
        const lastCart = this.#carts[this.#carts.length - 1];
        if (lastCart) {
            this.#lastCartId = lastCart.id + 1;
        }
    }

    // guardar el array en un archivo json de manera similar que en ProductManager
    async #saveFile() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.#carts, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error al guardar el archivo:', error);
            throw error;
        }
    }

    //  nuevo ID de manera similar que en ProductManager
    #getNewId() {
        return this.#lastCartId++;
    }

    //  los carritos del archivo de forma similar que en ProductManager
    async getCarts() {
        try {
            const fileContents = await fs.promises.readFile(this.path, 'utf-8');
            const existingCart = JSON.parse(fileContents);
            return existingCart;
        } catch (err) {
            return [];
        }
    }

    // Agregar un nuevo carrito
    async addCart() {
        try {

            // crea un nuevo carrito con el método correspondiente para agregar un ID y con un arreglo vacio donde se agregarán los IDs de los productos y las cantidades
            const cart = { id: parseInt(this.#getNewId()), products: [] }

            // agrega este carrito al array de carritos
            this.#carts.push(cart);

            // guarda en el archivo
            await this.#saveFile();
            console.log('Nuevo carrito creado')
        } catch {
            throw new Error('Hubo un error al generar el carrito');
        }
    }

    // obtener los carritos por ID de manera similar que en ProductManager
    async getCartById(cartId) {

        const numericCartId = parseInt(cartId)
        const existingCart = await this.getCarts();
        const filterCartById = existingCart.find(c => c.id === numericCartId);
        if (filterCartById) {
            return filterCartById;
        } else {
            throw new Error('Not Found: No existe el ID de carrito');
        }
    }

    // Agregar  al carrito
    async addProductToCart(productId, cartId) {
        try {
            
            const numericProductId = parseInt(productId)
            const product = await manager.getProductById(numericProductId);

            // ver que exista
            const numericCartId = parseInt(cartId)
            const cart = await this.getCartById(numericCartId);

            //  si el ID de producto se encuentra agregado o no
            const existingProduct = cart.products.find(p => p.id === numericProductId);

            if (existingProduct) {

                // Si el ID de producto existe aumenta su cantidad en 1
                existingProduct.quantity += 1;
            } else {

                // En caso de que no exista se genera un producto nuevo con una cantidad de 1
                const productToAdd = { id: product.id, quantity: 1 };

                // Se agrega el producto al correspondiente carrito
                cart.products.push(productToAdd);
            }

            // Se obtienen todos los carritos disponibles
            const updatedCarts = await this.getCarts();

            //  busca el ID del carrito que se va a actualizar
            const indexToUpdate = updatedCarts.findIndex(c => c.id === numericCartId);
            if (indexToUpdate !== -1) {

                updatedCarts[indexToUpdate] = cart;

                this.#carts = updatedCarts;

                // Guarda la lista 
                await this.#saveFile();
                console.log('Producto agregado al carrito correctamente');
                return cart;
            } else {
                throw new Error('No se encontró el carrito para actualizar');
            }

        } catch (error) {
            console.error('Error en addProductToCart:', error);
            throw new Error('Error al cargar el producto al archivo');
        }
    }
};

module.exports = CartManager;