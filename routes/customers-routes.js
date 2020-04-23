const express = require("express");

const customersControllers = require("../controllers/customers-controllers");

const router = express.Router();

router.get("/", customersControllers.getCustomers);
router.post("/signup", customersControllers.signup);
router.post("/login", customersControllers.login);

module.exports = router;
