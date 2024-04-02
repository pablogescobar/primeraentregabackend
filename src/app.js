const express = require('express');
const handlebars = require('express-handlebars');
const { Server } = require('socket.io');
const homeRouter = require('./routes/home.router');
const realTimeProductsRouter = require('./routes/realTimeProducts.router')
const app = express();


// Configuración de handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/../public`));

// Permitir envío de información mediante formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/home', homeRouter)
app.use('/api/realTimeProducts', realTimeProductsRouter)

const httpServer = app.listen(8080, () => {
    console.log('Servidor listo!');
});

const wsServer = new Server(httpServer);
app.set('ws', wsServer)

wsServer.on('connection', (socket) => {
    console.log('Nuevo cliente conectado via WebSocket');
})
app.get('/api/products', (req, res) => {
    
    const products = [
        { id: 1, name: 'Producto 1', price: 10 },
        { id: 2, name: 'Producto 2', price: 20 },
        // Agregar productos
    ];
    res.json(products);
});
