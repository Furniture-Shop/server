const router = require('express').Router();
// routes
const customerRouter = require('./customer');
const cartRouter = require('./cart');
const productRouter = require('./product');

router.use('/api/user', customerRouter);
router.use('/api/cart', cartRouter);
router.use('/api/product', productRouter);

module.exports = router;
