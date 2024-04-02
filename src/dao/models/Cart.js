const mongoose = require('mongoose');

// Define la estructura del esquema para el carrito
const cartSchema = new mongoose.Schema({
    // Aquí defines los campos y su tipo de datos para el carrito
    // Por ejemplo:
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Si estás utilizando usuarios, podría ser un ObjectId
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId, // El ID del producto en el carrito
                required: true
            },
            quantity: {
                type: Number, // La cantidad de ese producto en el carrito
                required: true,
                default: 1 // Puedes establecer un valor predeterminado si lo deseas
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now // Puedes establecer la fecha de creación del carrito automáticamente
    }
});

// Crea el modelo 'Cart' a partir del esquema
const Cart = mongoose.model('Cart', cartSchema);

// Exporta el modelo para que pueda ser utilizado en otros archivos
module.exports = Cart;
