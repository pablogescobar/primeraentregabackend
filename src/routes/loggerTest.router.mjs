const { Router } = require('express');
const router = Router();
const { Controller } = require('../controller/loggerTest.controller.mjs');

router.get('/', (req, res) => new Controller().startLogerTest(req, res));

module.exports = router;