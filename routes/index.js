const router = require('express').Router();
// routes
const customerRouter = require('./customer');
const cartRouter = require('./cart');
const productRouter = require('./product');
const itemRouter = require('./item');
const orderRouter = require('./order');

router.use('/api/customer', customerRouter);
router.use('/api/cart', cartRouter);
router.use('/api/product', productRouter);
router.use('/api/item', itemRouter);
router.use('/api/order', orderRouter);

module.exports = router;
