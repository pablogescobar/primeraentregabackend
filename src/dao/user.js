const mongoose = require('mongoose');

// Definir el esquema del usuario
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Crear el modelo de usuario a partir del esquema
const User = mongoose.model('User', userSchema);

// Exportar el modelo de usuario
module.exports = User;
