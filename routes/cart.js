const router = require('express').Router();

const CartController = require('../controllers/cart');

router.get('/:cid', CartController.getById);
router.post('/', CartController.create);
router.patch('/:cid', CartController.update);
router.delete('/:cid/:iid', CartController.deleteCart);

module.exports = router;
