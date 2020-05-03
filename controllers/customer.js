const { validationResult } = require('express-validator');
const Customer = require('../models/customer');
const { hashPassword, comparePassword } = require('../helpers/bcrypt');

class CustomerController {
  static async signUp(req, res, next) {
    // Check that there is no errors with the inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({
        msg: 'Invalid inputs passed, please check your data.',
        code: 422,
      });
    }

    const { fullName, email, password } = req.body;

    // Checking if an account with this email already exists
    let existingCustomer;
    try {
      existingCustomer = await Customer.findOne({ email });
    } catch (err) {
      return next({
        msg: 'Signing up failed, please try again later.',
        code: 500,
      });
    }

    if (existingCustomer) {
      return next({
        msg: 'User exists already, please login instead.',
        code: 422,
      });
    }

    let hashedPassword;
    try {
      const response = await hashPassword(password);
      if (response.success) {
        hashedPassword = response.hash;
      } else {
        return next({
          msg: 'Something went wrong when hashing, please try again.',
          code: 500,
        });
      }
    } catch (err) {
      return next({
        msg: 'Could not create customer, please try again.',
        code: 500,
      });
    }

    const createdCustomer = new Customer({
      fullName,
      email,
      password: hashedPassword,
    });

    try {
      await createdCustomer.save();
    } catch (err) {
      return next({
        msg: 'Signing up failed, please try again later.',
        code: 500,
      });
    }

    res.status(201).json({
      user: createdCustomer.toObject({ getters: true }),
    });
  }

  static async login(req, res, next) {
    // Checking that there is no errors with the inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({
        msg: 'Invalid inputs passed, please check your data.',
        code: 422,
      });
    }

    const { email, password } = req.body;

    // Checking if the account exists
    let existingCustomer;
    try {
      existingCustomer = await Customer.findOne({ email });
    } catch (err) {
      return next({
        msg: 'Logging in failed, please try again later.',
        code: 500,
      });
    }

    // Making sure that the credentials are correct
    if (!existingCustomer) {
      return next({
        msg: 'Invalid credentials, could not log you in.',
        code: 401,
      });
    }

    let isValidPassword = false;
    try {
      isValidPassword = await comparePassword(
        password,
        existingCustomer.password,
      );
    } catch (err) {
      return next({
        msg: 'Could not log you in, please check your credentials and try again.',
        code: 500,
      });
    }

    if (!isValidPassword) {
      return next({
        msg: 'Invalid credentials, could not log you in.',
        code: 401,
      });
    }

    res.json({
      msg: 'Logged in!',
      user: existingCustomer.toObject({ getters: true }),
    });
  }


  static async update(req, res, next) {
    const customerId = req.params.id;
    const { fullName, email, password } = req.body;
    let customer;

    try {
      customer = await Customer.findById(customerId);
    } catch (err) {
      return next({
        msg: 'Something went wrong, could not delete customer.',
        code: 500,
      });
    }

    if (!customer) {
      return next({ msg: 'Could not find customer for this id.', code: 404 });
    }

    // Check which field the customer wants to update
    if (fullName !== undefined) {
      customer.fullName = fullName;
    }

    if (email !== undefined) {
      customer.email = email;
    }

    if (password !== undefined) {
      let hashedPassword;
      try {
        const response = await hashPassword(password);
        if (response.success) {
          hashedPassword = response.hash;
        } else {
          return next({
            msg: 'Something went wrong when hashing, please try again.',
            code: 500,
          });
        }
      } catch (err) {
        return next({
          msg: 'Could not create customer, please try again.',
          code: 500,
        });
      }
      customer.password = hashedPassword;
    }

    try {
      customer.save();
      res.json({ msg: 'Customer updated. ' });
    } catch (err) {
      return next({
        msg: `Something went wrong, could not update Customer ${customerId}`,
        code: 500,
      });
    }
  }

  static async delete(req, res, next) {
    const customerId = req.params.id;
    let customer;

    try {
      customer = await Customer.findById(customerId);
    } catch (err) {
      return next({
        msg: 'Something went wrong, could not delete customer.',
        code: 500,
      });
    }

    if (!customer) {
      return next({
        msg: 'Could not find customer for this id.',
        code: 404,
      });
    }

    try {
      await customer.remove();
    } catch (err) {
      return next({
        msg: 'Something went wrong, could not delete customer.',
        code: 500,
      });
    }

    res.json({ msg: 'Deleted customer.' });
  }
}

module.exports = CustomerController;
