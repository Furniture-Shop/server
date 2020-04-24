const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const Item = require("../models/item");
const Cart = require("../models/cart");
const Product = require("../models/product");

class ItemController {
   static async create(req, res, next) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return next({
            msg: "Invalid inputs passed, please check your data",
            code: 422,
         });
      }

      const { cid: customerId, pid: productId } = req.params;
      const quantity = req.body.quantity;

      let product;
      try {
         product = await Product.findById(productId);
      } catch (err) {
         return next({
            msg: "Creating item failed, please try again.1",
            code: 500,
         });
      }

      if (!product) {
         return next({
            msg: "Could not find a product for the provided id",
            code: 404,
         });
      }

      let cart;
      try {
         cart = await Cart.findOne({ customerId }).populate("items");
      } catch (err) {
         return next({
            msg: "Creating item failed, please try again.2",
            code: 500,
         });
      }

      if (!cart) {
         return next({
            msg: "Could not find a cart for the provided id",
            code: 404,
         });
      }

      const createdItem = new Item({
         productId: product.id,
         cartId: cart.id,
         quantity,
      });

      try {
         const session = await mongoose.startSession();
         session.startTransaction();
         await cart.items.push(createdItem);
         await cart.save({ session });
         session.commitTransaction();
      } catch (err) {
         return next({
            msg: "Creating item failed, please try again3",
            code: 500,
         });
      }

      res.status(201).json({ item: createdItem.toObject({ getters: true }) });
   }

   static async update(req, res, next) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return next({
            msg: "Invalid inputs passed, please check your data",
            code: 422,
         });
      }

      const { iid: itemId, cid: customerId } = req.params;
      const quantity = req.body.quantity;

      let cart;
      try {
         cart = await Cart.findOne({ customerId }).populate("items");
      } catch (err) {
         return next({
            msg: "Updating item failed, please try again.",
            code: 500,
         });
      }

      if (!cart) {
         return next({
            msg: "Could not find a cart for the provided id.",
            code: 404,
         });
      }

      let item;
      try {
         console.log(cart.items);
         item = await cart.items.filter((i) => i.id === itemId)[0];
      } catch (err) {
         console.log(err);
         next({ msg: "Updating item failed, please try again.", code: 500 });
      }

      console.log(item);

      if (!item) {
         return next({
            msg: "Could not find an item for the provided id.",
            code: 404,
         });
      }

      item.quantity = quantity;

      try {
         await cart.save();
      } catch (err) {
         return next({
            msg: "Updating item failed, please try again.",
            code: 500,
         });
      }

      res.json({ item: item.toObject({ getters: true }) });
   }

   static async delete(req, res, next) {
      const itemId = req.params.iid;

      let item;
      try {
         item = await Item.findById(itemId).populate("cartId");
      } catch (err) {
         return next({
            msg: "Deleting item failed, please try again.",
            code: 500,
         });
      }

      if (!item) {
         return next({
            msg: "Could not find an item for the provided id.",
            code: 404,
         });
      }

      try {
         const session = mongoose.startSession();
         await item.cartId.items.pull(item);
         await item.cartId.save({ session });
         await item.remove({ session });
         await session.commitTransaction();
      } catch (err) {
         return next({
            msg: "Deleting item failed, please try again.",
            code: 500,
         });
      }

      res.json({ msg: "Deleted item." });
   }
}

module.exports = ItemController;
