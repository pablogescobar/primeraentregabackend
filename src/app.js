const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8080;


app.use(express.json());

//  cargar archivos JSON de productos
const loadJSON = (filename) => {
    try {
        const data = fs.readFileSync(filename);
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

//  guardar archivos JSON de productos
const saveJSON = (filename, data) => {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
};

// hacer un id ID único
const generateID = () => {
    return uuidv4();
};

// Rutas para los productos
const productsRouter = express.Router();

productsRouter.get('/', (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const products = loadJSON('src/productos.json');
    const limitedProducts = limit ? products.slice(0, limit) : products;
    res.json(limitedProducts);
});

productsRouter.get('/:pid', (req, res) => {
    const products = loadJSON('src/productos.json');
    const product = products.find(item => item.id === req.params.pid);
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

productsRouter.post('/', (req, res) => {
    const newProduct = req.body;
    newProduct.id = generateID();
    const products = loadJSON('src/productos.json');
    products.push(newProduct);
    saveJSON('src/productos.json', products);
    res.status(201).send('Producto agregado correctamente');
});

productsRouter.put('/:pid', (req, res) => {
    const updatedProduct = req.body;
    const products = loadJSON('src/productos.json');
    const index = products.findIndex(item => item.id === req.params.pid);
    if (index !== -1) {
        updatedProduct.id = req.params.pid; // Ensure ID remains the same
        products[index] = updatedProduct;
        saveJSON('src/productos.json', products);
        res.send('Producto actualizado correctamente');
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

productsRouter.delete('/:pid', (req, res) => {
    const products = loadJSON('src/productos.json');
    const filteredProducts = products.filter(item => item.id !== req.params.pid);
    if (products.length !== filteredProducts.length) {
        saveJSON('src/productos.json', filteredProducts);
        res.send('Producto eliminado correctamente');
    } else {
        res.status(404).send('Producto no encontrado');
    }
});

//  carritos
const cartsRouter = express.Router();

cartsRouter.post('/', (req, res) => {
    const newCart = {
        id: generateID(),
        products: []
    };
    const carts = loadJSON('src/carritos.json');
    carts.push(newCart);
    saveJSON('src/carritos.json', carts);
    res.status(201).send('Carrito creado correctamente');
});

cartsRouter.get('/:cid', (req, res) => {
    const carts = loadJSON('src/carritos.json');
    const cart = carts.find(item => item.id === req.params.cid);
    if (cart) {
        res.json(cart);
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const carts = loadJSON('src/carritos.json');
    const cartIndex = carts.findIndex(item => item.id === cid);
    if (cartIndex !== -1) {
        const cart = carts[cartIndex];
        const existingProductIndex = cart.products.findIndex(item => item.pid === pid);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity++;
        } else {
            cart.products.push({ pid, quantity: 1 });
        }
        saveJSON('src/carritos.json', carts);
        res.send('Producto agregado al carrito correctamente');
    } else {
        res.status(404).send('Carrito no encontrado');
    }
});

// ver routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Inicio  del servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
