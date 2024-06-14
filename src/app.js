const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const logger = require('./utils/logger'); // Importa el logger

dotenv.config();

// ROUTERS
const { productsRouter, productsViewsRouter, cartRouter, cartViewsRouter, createProductRouter, sessionRouter, sessionViewsRouter } = require('./routes');

const app = express();

app.engine('handlebars', handlebars());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`${__dirname}/../public`));

const initializeStrategy = require('./config/passport.config');
const { dbName, mongoUrl } = require('./dbconfig');
const sessionMiddleware = require('./session/mongoStorage');

app.use(sessionMiddleware);
initializeStrategy();
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

// Routes
app.use('/api/products', productsRouter);
app.use('/products', productsViewsRouter);
app.use('/api/cart', cartRouter);
app.use('/cart', cartViewsRouter);
app.use('/createProduct', createProductRouter);
app.use('/api/sessions', sessionRouter);
app.use('/', sessionViewsRouter);

const main = async () => {
    try {
        await mongoose.connect(mongoUrl, {
            dbName,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        app.listen(8080, () => {
            logger.info('Servidor cargado! http://localhost:8080');
        });
    } catch (error) {
        logger.error('Error al conectar a la base de datos:', error);
    }
};

main();

module.exports = app;
