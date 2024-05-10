const { Router } = require('express');
const router = Router();
const { verifyToken } = require('../utils/jwt');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/', verifyToken, (req, res) => {
    const isLoggedIn = req.cookies.accessToken !== undefined;

    if (isLoggedIn) {
        const cartId = req.user.cart;
        res.render('sessionStart', {
            titlePage: 'Login/Register',
            isLoggedIn,
            isNotLoggedIn: !isLoggedIn,
            style: ['styles.css'],
            cartId
        });
    } else {
        res.render('sessionStart', {
            titlePage: 'Login/Register',
            isLoggedIn,
            isNotLoggedIn: !isLoggedIn,
            style: ['styles.css'],
        });
    }
});

router.get('/login', (_, res) => {
    // TODO: agregar middleware, sólo se puede acceder si no está logueado
    res.render('login', {
        style: ['styles.css'],
        title: 'Login'
    });
});

router.get('/register', (_, res) => {
    // TODO: agregar middleware, sólo se puede acceder si no está logueado
    res.render('register', {
        style: ['styles.css'],
        title: 'Register'
    });
});

router.get('/profile', verifyToken, (req, res) => {
    try {
        const isLoggedIn = req.cookies.accessToken !== undefined;
        if (isLoggedIn) {
            const cartId = req.user.cart;
            const user = {
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                age: req.user.age,
                email: req.user.email,
                rol: req.user.rol,
            };

            res.render('profile', {
                style: ['styles.css'],
                titlePage: 'Perfil',
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    email: user.email,
                    rol: user.rol
                },
                isLoggedIn,
                cartId
            });
        } else {
            return res.status(403).json({ Error: 'Debe logearse para poder acceder.' });
        }
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

router.get('/resetPassword', async (_, res) => {
    try {
        res.render('reset_password', {
            titlePage: 'Reset Password',
            style: ['styles.css']
        });
    } catch (err) {
        res.status(500).json({ Error: err.message });
    }
});

module.exports = router;
