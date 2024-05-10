require('dotenv').config(); // Carga las variables de entorno desde .env
const passport = require('passport');
const cookieParser = require('cookie-parser');
const { generateToken } = require('../utils/jwt');
const { Router } = require('express'); 
const router = Router(); // Crea un enrutador



router.use(cookieParser());

router.post('/register', passport.authenticate('register', { failureRedirect: '/api/sessions/failregister', session: false }), (_, res) => {
    res.redirect('/');
});

router.post('/login', passport.authenticate('login', { failureRedirect: '/api/sessions/faillogin', session: false }), async (req, res) => {
    try {
        let user;
        if (req.user && req.user.email === 'adminCoder@coder.com') {
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
        res.redirect('/');
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


router.get('/current', passport.authenticate('current', { session: false }), async (req, res) => {
    return res.json(req.user)
})

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/githubcallback', passport.authenticate('github', { session: false, failureRedirect: '/login' }), async (req, res) => {
    try {
        // Envía el token JWT al cliente
        res.cookie('accessToken', req.user.accessToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
        res.redirect('/');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get('/faillogin', (_, res) => {
    res.send('Hubo un error de logeo.');
})

router.post('/resetPassword', passport.authenticate('resetPassword', { failureRedirect: '/api/sessions/failogin' }), async (_, res) => {
    try {
        res.redirect('/');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('accessToken'); // Elimina la cookie llamada 'accessToken'
    res.redirect('/');
});

router.get('/failregister', (_, res) => {
    res.send('Hubo un error de registro.');
})

router.get('/faillogin', (_, res) => {
    res.send('Hubo un error de logeo.');
})

module.exports = router;