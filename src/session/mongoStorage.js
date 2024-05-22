const session = require('express-session');
const MongoStore = require('connect-mongo');
const { mongoUrl, dbName } = require('../dbconfig');

module.exports = session({
    secret: 'tu_secreto',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: `${mongoUrl}/${dbName}`,  // Usa la URL completa con el nombre de la base de datos
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60 // 14 días
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 14 // 14 días
    }
});
