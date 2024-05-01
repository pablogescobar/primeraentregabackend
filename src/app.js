const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const user = require('.src/models/user'); // Importar el modelo de usuario correctamente
const homeRouter = require('./routes/home.router');
const realTimeProductsRouter = require('./routes/realTimeProducts.router');

const app = express();

// Configuración de handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/../public`));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de Passport.js
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
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

const httpServer = app.listen(8080, () => {
    console.log('Servidor listo!');
});

const wsServer = new Server(httpServer);
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
