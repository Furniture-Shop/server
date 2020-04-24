const router = require("express").Router();
const { check } = require("express-validator");

const ProductController = require("../controllers/product");

router.get("/", ProductController.findAll);
router.get("/:pid", ProductController.findById);
router.post(
   "/",
   [
      check("name").not().isEmpty(),
      check("price").not().isEmpty(),
      check("material").not().isEmpty(),
      check("dimensions").not().isEmpty(),
   ],
   ProductController.create
);
router.put(
   "/:pid",
   [
      check("name").not().isEmpty(),
      check("price").not().isEmpty(),
      check("material").not().isEmpty(),
      check("dimensions").not().isEmpty(),
   ],
   ProductController.update
);
router.delete("/:pid", ProductController.deleteProduct);

module.exports = router;
