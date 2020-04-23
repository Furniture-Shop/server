const router = require('express').Router();

const CustomerController = require('../controllers/customer');

router.post('/signup', CustomerController.signUp);
router.post('/login', CustomerController.login);

module.exports = router;
