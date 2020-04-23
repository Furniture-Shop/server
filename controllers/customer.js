const Customer = require("../models/customer");

class CustomerController {
   static async signUp(req, res, next) {
      const { fullName, email, password } = req.body;

      let existingCustomer;
      try {
         existingCustomer = await Customer.findOne({ email });
      } catch (err) {
         return res
            .status(500)
            .json({ msg: "Signing up failed, please try again later." });
      }

      if (existingCustomer) {
         return res
            .status(422)
            .json({ msg: "User exists already, please login instead." });
      }

      const createdCustomer = new Customer({
         fullName,
         email,
         password,
      });

      try {
         await createdCustomer.save();
      } catch (err) {
         return res
            .status(500)
            .json({ msg: "Signing up failed, please try again later." });
      }

      res.status(201).json({
         user: createdCustomer.toObject({ getters: true }),
      });
   }

   static async login(req, res, next) {
      const { email, password } = req.body;

      let existingCustomer;
      try {
         existingCustomer = await Customer.findOne({ email });
      } catch (err) {
         return res.status(500).json({
            msg: "Logging in failed, please try again later.",
         });
      }

      if (!existingCustomer || existingCustomer.password !== password) {
         return res.status(401).json({
            msg: "Invalid credentials, could not log you in.",
         });
      }

      res.json({
         msg: "Logged in!",
         user: existingCustomer.toObject({ getters: true }),
      });
   }
}

module.exports = CustomerController;
