const router = require('express').Router();
const { check } = require('express-validator');

const CustomerController = require('../controllers/customer');

router.post(
  '/signup',
  [
    check('fullName').not().isEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  CustomerController.signUp,
);
router.post(
  '/login',
  [check('email').isEmail(), check('password').isLength({ min: 6 })],
  CustomerController.login,
);

router.put(
  '/:id',
  [
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
  ],
  CustomerController.update,
);

router.delete('/:id', CustomerController.delete);

module.exports = router;
