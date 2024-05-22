const { Router } = require('express'); // Importa la clase Router de Express para definir las rutas
const router = Router(); // Crea un enrutador
const { Controller } = require('../controller/cart.controller');

// obtener todos los carritos
router.get('/', (_, res) => new Controller().getCarts(res));

//obtener un carrito por su ID
router.get('/:cid', (req, res) => new Controller().getCartById(req, res));

// agregar un nuevo carrito
router.post('/', (_, res) => new Controller().addCart(res));

// agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => new Controller().addProductToCart(req, res));

// agregar o actualizar productos del carrito
router.put('/:cid', (req, res) => new Controller().updatedCart(req, res));

//eliminar un producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => new Controller().deleteProductFromCart(req, res));

//  cantidad de un producto en el carrito
router.put('/:cid/product/:pid', (req, res) => new Controller().updateProductQuantityFromCart(req, res));

// vaciar el carrito
router.delete('/:cid', async (req, res) => new Controller().clearCart(req, res))

module.exports = router; // Exporta 