const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    // Definir la estructura del esquema para el mensaje
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
