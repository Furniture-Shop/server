const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const Cart = require('../models/cart');
const Customer = require('../models/customer');

class CartController {
  static async getByCustomerId(req, res, next) {
    const customerId = req.params.cid;

    let cart;
    try {
      cart = await Cart.findOne({ customerId }).populate('items');
    } catch (err) {
      return next({
        msg: 'Something went wrong, could not find a cart.',
        code: 500,
      });
    }

    if (!cart) {
      return next({
        msg: 'Could not find cart for the provided id.',
        code: 404,
      });
    }

    res.json({ cart: cart.toObject({ getters: true }) });
  }

  static async create(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({
        msg: 'Invalid inputs passed, please check your data',
        code: 422,
      });
    }

    const customerId = req.params.cid;

    let cart;
    try {
      cart = await Cart.findOne({ customerId });
    } catch (err) {
      return next({
        msg: 'Creating cart failed, please try again.',
        code: 500,
      });
    }

    if (cart) {
      return next({ msg: 'Cart already exists', code: 406 });
    }

    let customer;
    try {
      customer = await Customer.findById(customerId);
    } catch (err) {
      return next({
        msg: 'Creating cart failed, please try again.',
        code: 500,
      });
    }

    if (!customer) {
      return next({
        msg: 'Could not find a customer for the provided id.',
        code: 404,
      });
    }

    const date = new Date();
    const createdCart = new Cart({
      customerId,
      createdAtDate: date.getTime(),
      items: [],
    });

    try {
      await createdCart.save();
    } catch (err) {
      return next({
        msg: 'Creating cart failed, please try again.',
        code: 500,
      });
    }

    res.status(201).json({ cart: createdCart });
  }

  static async emptyCartByCustomerId(req, res, next) {
    const customerId = req.params.cid;

    let cart;
    try {
      cart = await Cart.findOne({ customerId }).populate('items');
    } catch (err) {
      return next({
        msg: 'Something went wrong, could not delete cart',
        code: 500,
      });
    }

    if (!cart) {
      return next({ msg: 'Could not find cart for this customer id.', code: 404 });
    }

    try {
      const session = await mongoose.startSession();
      session.startTransaction();
      await cart.items.map((item) => item.remove({ session }));
      cart.items.map((item) => cart.items.pull(item));
      await cart.save();
      session.commitTransaction();
    } catch (err) {
      return next({
        msg: 'Something went wrong, could not delete cart.',
        code: 500,
      });
    }

    res.json({ msg: 'Emptied cart.' });
  }
}

module.exports = CartController;
