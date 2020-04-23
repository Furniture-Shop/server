const mongoose = require("mongoose");
const { validationResult } = require("express-validator");
const Cart = require("../models/cart");
const Customer = require("../models/customer");

class CartController {
   static async getByCustomerId(req, res, next) {
      const customerId = req.params.cid;

      let cart;
      try {
         cart = await Cart.findOne({ customerId });
      } catch (err) {
         next({
            msg: "Something went wrong, could not find a cart.",
            code: 500,
         });
      }

      if (!cart) {
         next({ msg: "Could not find cart for the provided id.", code: 404 });
      }

      res.json({ cart: cart.toObject({ getters: true }) });
   }

   static async create(req, res, next) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         next({
            msg: "Invalid inputs passed, please check your data",
            code: 422,
         });
      }

      const customerId = req.params.cid;

      let customer;
      try {
         customer = await Customer.findById(customerId);
      } catch (err) {
         next({ msg: "Creating cart failed, please try again.", code: 500 });
      }

      if (!customer) {
         next({
            msg: "Could not find a customer for the provided id.",
            code: 404,
         });
      }

      const date = new Date();
      const createdCart = new Cart({
         customerId,
         createdAtDate: date.getDate(),
      });

      try {
         await createdCart.save();
      } catch (err) {
         next({ msg: "Creating cart failed, please try again.", code: 500 });
      }

      res.status(201).json({ cart: createdCart });
   }

   static async deleteCart(req, res, next) {
      const cartId = req.params.cid;

      let cart;
      try {
         cart = await Cart.findById(cartId).populate("items");
      } catch (err) {
         next({
            msg: "Something went wrong, could not delete cart",
            code: 500,
         });
      }

      if (!cart) {
         next({ msg: "Could not find place for this id.", code: 404 });
      }

      try {
         const session = await mongoose.startSession();
         session.startTransaction();
         await cart.items.map((item) => {
            item.remove();
         });
         await cart.remove({ session });
         await session.commitTransaction();
      } catch (err) {
         next({
            msg: "Something went wrong, could not delete place.",
            code: 500,
         });
      }

      res.json({ msg: "Deleted place." });
   }
}

module.exports = CartController;
