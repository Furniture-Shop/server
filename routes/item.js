const router = require('express').Router();
const ItemController = require('../controllers/item');
const { check } = require('express-validator');

router.post(
	'/:cid/:pid',
	check('quantity').not().isEmpty(),
	ItemController.create
);
router.patch('/:iid', check('quantity').not().isEmpty(), ItemController.update);
router.delete('/:iid', ItemController.delete);

module.exports = router;
