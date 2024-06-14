// src/config/passport.config.js
const passport = require('passport');
const initializeStrategies = require('./strategies');
const { UserRepository } = require('../repository/user.repository');
const logger = require('../utils/logger'); // Importa el logger

const initializeStrategy = () => {
    initializeStrategies();

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const userRepo = new UserRepository();
        try {
            const user = await userRepo.getUserById(id);
            done(null, user);
        } catch (error) {
            logger.error('Error en deserializeUser:', error);
            done(error, null);
        }
    });
};

module.exports = initializeStrategy;
