// src/models/index.js
const { Carts } = require('./cart.model');
const { Users } = require('./user.model.mjs');
const { Products } = require('./product.model.mjs');

module.exports = {
    Carts,
    Users,
    Products,
};
