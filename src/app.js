const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./dao/user');
const homeRouter = require('./routes/home.router');
const realTimeProductsRouter = require('./routes/realTimeProducts.router');
const handlebars = require('express-handlebars');
const { Server } = require('ws'); // Agregar esta línea para importar Server de ws

const app = express();

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views')); // Utiliza path.join para evitar problemas de ruta
app.set('view engine', 'handlebars');

// Middleware para las sesiones
app.use(session({
    secret: 'tu_secreto',
    resave: false,
    saveUninitialized: false
}));

// Configuración de Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Estrategia de autenticación local con Passport.js
passport.use(new LocalStrategy({  usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado.' });
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) { return done(err); }
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Contraseña incorrecta.' });
            }
        });
    });
}));

// Serialización y deserialización de usuario con Passport.js
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Rutas de autenticación
app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}));

app.post('/register', (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) throw err;
        const newUser = new User({
            email: req.body.email,
            password: hashedPassword
        });
        newUser.save((err) => {
            if (err) {
                console.error(err);
                res.redirect('/register');
            } else {
                res.redirect('/login');
            }
        });
    });
});

// Rutas de vistas
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

// Rutas de la API
app.use('/api/home', homeRouter);
app.use('/api/realTimeProducts', realTimeProductsRouter);

// Iniciar servidor HTTP
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

// Iniciar servidor WebSocket
const wsServer = new Server({ server }); // Pasar el servidor HTTP como argumento
app.set('ws', wsServer);

wsServer.on('connection', (socket) => {
    console.log('Nuevo cliente conectado via WebSocket');
});

app.get('/api/products', (req, res) => {
    const products = [
        { id: 1, name: 'Producto 1', price: 10 },
        { id: 2, name: 'Producto 2', price: 20 },
        { id: 3, name: 'Producto 3', price: 30 },
        // Agregar productos
    ];
    res.json(products);
});
