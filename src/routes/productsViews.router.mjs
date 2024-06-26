const { Router } = require('express'); // Importa la clase Router de Express para definir las rutas
const { verifyToken } = require('../utils/jwt.mjs');
const router = Router(); // Crea un enrutador
const { Controller } = require('../controller/productsView.controller.mjs');

// Ruta para obtener todos los productos
router.get('/', verifyToken, (req, res) => new Controller().getProducts(req, res));

//obtener un producto por su ID
router.get('/:pid', verifyToken, (req, res) => new Controller().getProductById(req, res));

//  agregar producto al carrito
router.post('/:pid', verifyToken, (req, res) => new Controller().addProductToCart(req, res));

//  agregar un nuevo producto
router.post('/', async (req, res) => new Controller().addProduct(req, res));

module.exports = router; //  enrutador