const mongoose = require('mongoose');
const User = require('../models/user.model'); // Asegúrate de que el modelo User esté en la ruta correcta
const logger = require('../utils/logger'); // Importa el logger

class daoUsers {
    async getUserById(id) {
        try {
            const user = await User.findById(id);
            return user;
        } catch (error) {
            logger.error('Error al obtener usuario por ID:', error);
            throw error;
        }
    }

    async loginUser(username, password) {
        try {
            const user = await User.findOne({ username, password });
            if (!user) {
                throw new Error('Credenciales inválidas');
            }
            return user;
        } catch (error) {
            logger.error('Error en loginUser:', error);
            throw error;
        }
    }

    async githubLogin(profile) {
        try {
            const user = await User.findOneAndUpdate(
                { githubId: profile.id },
                { $set: { githubProfile: profile } },
                { new: true, upsert: true }
            );
            return { user };
        } catch (error) {
            logger.error('Error en githubLogin:', error);
            throw error;
        }
    }

    async deleteUser(email) {
        try {
            await User.findOneAndDelete({ email });
        } catch (error) {
            logger.error('Error al eliminar usuario:', error);
            throw error;
        }
    }
}

module.exports = daoUsers;
