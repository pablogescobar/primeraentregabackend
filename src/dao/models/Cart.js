const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
    //  campos y  tipo de datos para el carrito
    
    userId: {
        type: mongoose.Schema.Types.ObjectId, // s utilizando usuarios, puede ser un ObjectId
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId, //  ID del producto en el carrito
                required: true
            },
            quantity: {
                type: Number, //  cantidad de  producto en el carro
                required: true,
                default: 1 //  valor predeterminado si lo deseas
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now //  fecha de creación del carrito automáticamente
    }
});

// Crea el modelo 'Cart' a partir del esquema
const Cart = mongoose.model('Cart', cartSchema);

// Exporta el modelo para que pueda ser utilizado en otros archivos
module.exports = Cart;
