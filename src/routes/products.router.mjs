const { Router } = require('express'); // Importa  Router de Express para definir las rutas
const router = Router(); // Crea un enrutador
const { Controller } = require('../controller/products.controller.mjs');
const { verifyToken } = require('../utils/jwt.mjs');

//  obtener todos los produtos
router.get('/', (req, res) => new Controller().getProducts(req, res));

//  obtener un producto por su ID
router.get('/:pid', async (req, res) => new Controller().getProductsById(req, res));

//  agregar producto al carrito
router.post('/:pid', verifyToken, async (req, res) => new Controller().addProductToCart(req, res));

//  agregar un nuevo producto
router.post('/', async (req, res) => new Controller().addProduct(req, res));

// a actualizar un producto por su ID
router.put('/:pid', async (req, res) => new Controller().updateProduct(req, res));

//  eliminar un producto por su ID
router.delete('/:pid', async (req, res) => new Controller().deleteProduct(req, res));

module.exports = router; //  enrutador