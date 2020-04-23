const router = require("express").Router();
// routes
const customerRouter = require("./customer");
const cartRouter = require("./cart");
const productRouter = require("./product");
const itemRouter = require("./item");

router.use("/api/user", customerRouter);
router.use("/api/cart", cartRouter);
router.use("/api/product", productRouter);
router.use("api/item", itemRouter);

module.exports = router;
