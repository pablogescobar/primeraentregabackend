const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'coladas'
        },
        quantity: {
            type: Number,
            default: 0
        }
    }]
});

schema.virtual('id').get(function () {
    return this._id.toString()
});

module.exports = mongoose.model('Carts', schema, 'carts');