const router = require('express').Router();
const { check } = require('express-validator');
const OrderController = require('../controllers/order');

router.get('/', OrderController.findAll);
router.get('/:oid', OrderController.getOrder);
router.post(
  '/',
  [
    check('totalPrice').not().isEmpty(),
    check('customer').not().isEmpty(),
    check('invoiceNo').not().isEmpty(),
    check('items').not().isEmpty(),
    check('status').not().isEmpty(),
  ],
  OrderController.create,
);
router.put(
  '/:oid',
  [
    check('totalPrice').not().isEmpty(),
    check('customer').not().isEmpty(),
    check('invoiceNo').not().isEmpty(),
    check('items').not().isEmpty(),
    check('status').not().isEmpty(),
  ],
  OrderController.update,
);
router.delete('/:oid', OrderController.delete);

module.exports = router;
