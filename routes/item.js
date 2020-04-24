const router = require("express").Router();
const ItemController = require("../controllers/item");
const { check } = require("express-validator");

router.post(
   "/:cid/:pid",
   check("quantity").not().isEmpty(),
   ItemController.create
);
router.patch(
   "/:cid/:iid",
   check("quantity").not().isEmpty(),
   ItemController.update
); // The cid parameter is temporary until we add jwt
router.delete("/:cid/:iid", ItemController.delete);

module.exports = router;
