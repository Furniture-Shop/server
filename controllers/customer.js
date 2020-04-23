const { validationResult } = require("express-validator");

const Customer = require("../models/customer");

class CustomerController {
   static async signUp(req, res, next) {
      // Check that there is no errors with the inputs
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         next({
            msg: "Invalid inputs passed, please check your data.",
            code: 422,
         });
      }

      const { fullName, email, password } = req.body;

      // Checking if an account with this email already exists
      let existingCustomer;
      try {
         existingCustomer = await Customer.findOne({ email });
      } catch (err) {
         next({
            msg: "Signing up failed, please try again later.",
            code: 500,
         });
      }

      if (existingCustomer) {
         next({ msg: "User exists already, please login instead.", code: 422 });
      }

      const createdCustomer = new Customer({
         fullName,
         email,
         password,
      });

      try {
         await createdCustomer.save();
      } catch (err) {
         next({ msg: "Signing up failed, please try again later.", code: 500 });
      }

      res.status(201).json({
         user: createdCustomer.toObject({ getters: true }),
      });
   }

   static async login(req, res, next) {
      // Checking that there is no errors with the inputs
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         next({
            msg: "Invalid inputs passed, please check your data.",
            code: 422,
         });
      }

      const { email, password } = req.body;

      // Checking if the account exists
      let existingCustomer;
      try {
         existingCustomer = await Customer.findOne({ email });
      } catch (err) {
         next({ msg: "Logging in failed, please try again later.", code: 500 });
      }

      // Making sure that the credentials are correct
      if (!existingCustomer || existingCustomer.password !== password) {
         next({ msg: "Invalid credentials, could not log you in.", code: 401 });
      }

      res.json({
         msg: "Logged in!",
         user: existingCustomer.toObject({ getters: true }),
      });
   }
}

module.exports = CustomerController;
