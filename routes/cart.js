const router = require("express").Router();
const { check } = require("express-validator");

const CartController = require("../controllers/cart");

router.get("/:cid", CartController.getByCustomerId);
router.post("/:cid", CartController.create);
router.delete("/:cid", CartController.deleteCartByCustomerId);

module.exports = router;
