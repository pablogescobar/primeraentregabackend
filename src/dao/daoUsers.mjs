// daoUsers.mjs

import User from '../models/user.model.js'; // Ajusta la ruta y la extensión del archivo según tu estructura de directorios

async function getAllUsers() {
  try {
    const users = await User.find(); // Consulta todos los usuarios usando Mongoose
    return users;
  } catch (error) {
    console.error('Error al obtener todos los usuarios:', error);
    throw error; // Re-lanza el error para que lo maneje el código que llama a esta función
  }
}

export { getAllUsers };
