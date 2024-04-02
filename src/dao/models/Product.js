const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // Definir la estructura del esquema para el producto
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
