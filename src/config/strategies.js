const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const { generateToken } = require('../middlewares/jwt.middleware');
const { ExtractJwt } = require('passport-jwt');
const { UserRepository } = require('../repository/user.repository');
const LocalStrategy = require('passport-local').Strategy;

module.exports = () => {
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            const userRepo = new UserRepository();
            try {
                const user = await userRepo.loginUser(username, password);
                return done(null, user);
            } catch (error) {
                return done(null, false, { message: error.message });
            }
        }
    ));

    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/github/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        const userRepo = new UserRepository();
        try {
            const { user } = await userRepo.githubLogin(profile);
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    }));

    passport.use(new OAuth2Strategy({
        clientID: process.env.OAUTH2_CLIENT_ID,
        clientSecret: process.env.OAUTH2_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/oauth2/callback",
        authorizationURL: "http://example.com/oauth2/authorize" // Reemplaza con la URL real de autorización
    },
    async (accessToken, refreshToken, profile, done) => {
        // Lógica de verificación de la estrategia OAuth2
    }));

    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET
    }, 
    async (jwtPayload, done) => {
        const userRepo = new UserRepository();
        try {
            const user = await userRepo.getUserById(jwtPayload.id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    }));
};
