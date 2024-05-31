const passport = require('passport');
const initializeStrategies = require('./strategies');
const { UserRepository } = require('../repository/user.repository');

const initializeStrategy = () => {
    initializeStrategies();  // Inicializar las estrategias

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const userRepo = new UserRepository();
        try {
            const user = await userRepo.getUserById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

module.exports = initializeStrategy;
