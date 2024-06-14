// src/models/user.model.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  // Otros campos del usuario según tu aplicación
});

const User = mongoose.model('User', userSchema);

export default User;
