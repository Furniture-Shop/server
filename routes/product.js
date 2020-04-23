const router = require('express').Router();

const ProductController = require('../controllers/product');

router.get('/', ProductController.findAll);
router.get('/:pid', ProductController.findById);
router.post('/', ProductController.create);
router.patch('/:pid', ProductController.update);
router.delete('/:pid', ProductController.deleteProduct);

module.exports = router;
