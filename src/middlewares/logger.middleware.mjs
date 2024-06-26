const { logger } = require('../utils/logger.mjs');

module.exports = {
    useLogger: (req, res, next) => {
        req.logger = logger;
        next();
    }
}