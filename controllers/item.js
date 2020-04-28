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

      const { cid: cartId, pid: productId } = req.params;
      const quantity = req.body.quantity;

      // I do it in that order because if the item already exists I need the cart but I will not need the product
      let cart;
      try {
         cart = await Cart.findById(cartId).populate("items");
      } catch (err) {
         return next({
            msg: "Creating item failed, please try again.",
            code: 500,
         });
      }

      if (!cart) {
         return next({
            msg: "Could not find a cart for the provided id",
            code: 404,
         });
      }

      let item;
      try {
         item = await Item.findOne({ cartId, productId });
      } catch (err) {
         return next({
            msg: "Creating item failed, please try again.",
            code: 500,
         });
      }

      if (item) {
         item.quantity = parseInt(item.quantity) + parseInt(quantity);
         try {
            const session = await mongoose.startSession();
            session.startTransaction();
            await item.save({ session });
            await cart.save({ session });
            session.commitTransaction();
         } catch (err) {
            return next({
               msg: "Item already exists. Updating the item failed",
               code: 500,
            });
         }
         return res.json({ item: item.toObject({ getters: true }) });
      }

      let product;
      try {
         product = await Product.findById(productId);
      } catch (err) {
         return next({
            msg: "Creating item failed, please try again.",
            code: 500,
         });
      }

      if (!product) {
         return next({
            msg: "Could not find a product for the provided id",
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
         await createdItem.save();
         await cart.items.push(createdItem);
         await cart.save({ session });
         session.commitTransaction();
      } catch (err) {
         return next({
            msg: "Creating item failed, please try again.",
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

      const itemId = req.params.iid;
      const quantity = req.body.quantity;

      let item;
      try {
         item = await Item.findById(itemId);
      } catch (err) {
         return next({
            msg: "Updating item failed, please try again.",
            code: 500,
         });
      }

      if (!item) {
         return next({
            msg: "Could not find an item for the provided id.",
            code: 404,
         });
      }

      // Only needed to be able to save
      let cart;
      try {
         cart = await Cart.findById(item.cartId);
      } catch (err) {
         return next({
            msg: "Updating item failed, please try again.",
            code: 500,
         });
      }

      // Probably not needed because the item is pushed to a cart when created
      if (!cart) {
         return next({
            msg: "Could not find a cart for the provided customer id.",
            code: 404,
         });
      }

      item.quantity = quantity;

      try {
         const session = await mongoose.startSession();
         session.startTransaction();
         await item.save({ session });
         await cart.save({ session });
         session.commitTransaction();
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
         item = await Item.findById(itemId);
      } catch (err) {
         return next({
            msg: "Deleting item failed, please try again",
            code: 500,
         });
      }

      if (!item) {
         return next({
            msg: "Could not find an item for the provided id.",
            code: 404,
         });
      }

      let cart;
      try {
         cart = await Cart.findById(item.cartId).populate("items");
      } catch (err) {
         return next({
            msg: "Deleting item failed, please try again",
            code: 500,
         });
      }

      try {
         const session = await mongoose.startSession();
         session.startTransaction();
         await cart.items.pull(item);
         await cart.save({ session });
         await item.remove({ session });
         session.commitTransaction();
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
