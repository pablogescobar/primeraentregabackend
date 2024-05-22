const { Router } = require('express'); // Importa  Router de Express
const { verifyToken } = require('../utils/jwt');
const router = Router(); //  enrutador
const { Controller } = require('../controller/cartView.controller');

//  obtener un carrito por su ID
router.get('/:cid', verifyToken, async (req, res) => new Controller().getCartById(req, res));

module.exports = router; // Exporta el enrutador