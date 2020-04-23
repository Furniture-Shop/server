const express = require("express");

const productsControllers = require("../controllers/products-controllers");

const router = express.Router();

router.get("/", productsControllers.getProducts);
router.get("/:pid", productsControllers.getProductById);
router.post("/", productsControllers.createProduct);
router.put("/:pid", productsControllers.updateProduct);
router.delete("/:pid", productsControllers.deleteProduct);

module.exports = router;
