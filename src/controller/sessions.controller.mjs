require('dotenv').config();
const { Router } = require('express');
const router = Router();
const { generateToken } = require('../utils/jwt.mjs');
const cookieParser = require('cookie-parser');
const daoUsers = require('../dao/mongo/daoUsers.mjs');
const logger = require('../utils/logger.mjs'); // Importa el logger

router.use(cookieParser());

class Controller {
    constructor() { }

    redirect(res) {
        try {
            res.redirect('/');
        } catch (e) {
            logger.error('Error en redirect:', e);
            res.status(500).json({ error: e.message });
        }
    }

    logError(res) {
        try {
            res.send('Hubo un error al identificar sus credenciales.');
        } catch (e) {
            logger.error('Error en logError:', e);
            res.status(500).json({ error: e.message });
        }
    }

    login(req, res) {
        try {
            let user;
            if (req.user && req.user.email === process.env.ADMIN_USER) {
                user = req.user;
            } else {
                user = {
                    email: req.user.email,
                    _id: req.user._id.toString(),
                    rol: req.user.rol,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    age: req.user.age,
                    cart: req.user.cart ? req.user.cart._id : null
                };
            }
            const accessToken = generateToken(user);
            res.cookie('accessToken', accessToken, { maxAge: 60 * 5 * 1000, httpOnly: true });
            logger.info(`Usuario logueado: ${user.email}`);
            res.redirect('/');
        } catch (e) {
            logger.error('Error en login:', e);
            res.status(500).json({ error: e.message });
        }
    }

    current(req, res) {
        try {
            const user = {
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                age: req.user.age,
                email: req.user.email,
                rol: req.user.rol,
                cart: req.user.cart
            }
            res.json(user);
        } catch (e) {
            logger.error('Error en current:', e);
            res.status(500).json({ error: e.message });
        }
    }

    githubCb(req, res) {
        try {
            res.cookie('accessToken', req.user.accessToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
            res.redirect('/');
        } catch (err) {
            logger.error('Error en githubCb:', err);
            res.status(500).json({ error: err.message });
        }
    }

    logout(res) {
        try {
            res.clearCookie('accessToken');
            res.redirect('/');
        } catch (e) {
            logger.error('Error en logout:', e);
            res.status(500).json({ error: e.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const { email } = req.body;
            await new daoUsers().deleteUser(email);
            logger.info(`Usuario eliminado: ${email}`);
            res.json({ message: 'Usuario eliminado correctamente.' });
        } catch (e) {
            logger.error('Error en deleteUser:', e);
            res.status(500).json({ error: e.message });
        }
    }
}

module.exports = { Controller };
