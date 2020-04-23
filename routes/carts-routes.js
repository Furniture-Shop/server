const express = require("express");

const cartsControllers = require("../controllers/carts-controllers");

const router = express.Router();

router.get("/:cid", cartsControllers.getCartById);
router.post("/", cartsControllers.createCart);
router.post("/:cid", cartsControllers.addItemToCart);
router.put("/:cid/:iid", cartsControllers.updateItemFromCart);
router.delete("/:cid/:iid", cartsControllers.deleteItemFromCart);

module.exports = router;
