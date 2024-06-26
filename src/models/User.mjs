const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
  // Puedes agregar más campos según tus necesidades
});

const User = mongoose.model('User', userSchema);

module.exports = User;
