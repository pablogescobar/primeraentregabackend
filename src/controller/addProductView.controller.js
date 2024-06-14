const daoProducts = require('../dao/mongo/daoProducts');
const logger = require('../utils/logger'); // Importa el logger

class Controller {
    constructor() { }

    viewForm(req, res) {
        try {
            const isLoggedIn = req.cookies.accessToken !== undefined;
            const adminUser = req.user.rol;
            if (adminUser === 'user') {
                logger.warn('Intento de acceso sin permiso por usuario.');
                return res.render('error', {
                    titlePage: 'Error',
                    message: 'No tiene permisos de acceso.',
                    style: ['styles.css'],
                    isLoggedIn
                });
            }

            res.render('createProduct', {
                titlePage: 'Agregar Producto',
                style: ['styles.css'],
                script: ['createProduct.js'],
                isLoggedIn
            });
        } catch (e) {
            logger.error('Error en viewForm:', e);
            res.status(500).json({ error: e.message });
        }
    }

    async addProduct(req, res) {
        try {
            const { title, description, price, thumbnail, code, status, stock } = req.body;

            await new daoProducts().addProduct(title, description, price, thumbnail, code, status, stock);

            logger.info(`Producto agregado: ${title}`);
            res.status(301).redirect('/products');
        } catch (error) {
            logger.error('Error al agregar producto:', error);
            res.status(500).send('Error interno del servidor');
        }
    }
}

module.exports = { Controller };
