const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const Item = require("../models/item");
const Cart = require("../models/cart");
const Product = require("../models/product");

class ItemController {
   static async create(req, res, next) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         next({
            msg: "Invalid inputs passed, please check your data",
            code: 422,
         });
      }

      const { cid: cartId, pid: productId } = req.params;
      const quantity = req.body.quantity;

      let product;
      try {
         product = await Product.findById(productId);
      } catch (err) {
         next({ msg: "Creating item failed, please try again.", code: 500 });
      }

      if (!product) {
         next({
            msg: "Could not find a product for the provided id",
            code: 404,
         });
      }

      let cart;
      try {
         cart = await Cart.findById(cartId).populate("items");
      } catch (err) {
         next({ msg: "Creating item failed, please try again.", code: 500 });
      }

      if (!cart) {
         next({ msg: "Could not find a cart for the provided id", code: 404 });
      }

      const createdItem = new Item({
         productId = product.id,
         cartId = cart.id,
         quantity
      });

      try {
         const session = await mongoose.startSession();
         session.startTransaction();
         await createdItem.save({session});
         await cart.items.push(createdItem);
         await cart.save({session});
         session.commitTransaction();
      } catch(err) {
         next({msg: "Creating item failed, please try again", code: 500})
      }

      res.status(201).json({item: createdItem.toObject({getters: true})});
   }

   static async update(req, res, next) {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
         next({
            msg: "Invalid inputs passed, please check your data",
            code: 422,
         });
      }

      const itemId = req.params.iid;
      const quantity = req.body.quantity;

      let item;
      try {
         item = await Item.findById(itemId);
      } catch(err) {
         next({msg: "Updating item failed, please try again.", code: 500});
      }

      if(!item) {
         next({msg: "Could not find an item for the provided id.", code: 404});
      }

      item.quantity = quantity;

      try {
         const session = mongoose.startSession();
         await item.save({session});
         await item.cartId.save({session});
      } catch(err) {
         next({msg: "Updating item failed, please try again.", code: 500});
      }

      res.json({item: item.toObject({getters: true})});
   }

   static async delete(req, res, next) {
      const itemId = req.params.iid;

      let item;
      try {
         item = await Item.findById(itemId).populate("cartId");
      } catch(err) {
         next({msg: "Deleting item failed, please try again.", code: 500});
      }

      if(!item) {
         next({msg: "Could not find an item for the provided id.", code: 404});
      }

      try {
         const session = mongoose.startSession();
         await item.cartId.items.pull(item);
         await item.cartId.save({session});
         await item.remove({session});
         await session.commitTransaction();
      } catch(err) {
         next({msg: "Deleting item failed, please try again.", code: 500});
      }

      res.json({msg: "Deleted item."});
   }
}

module.exports = ItemController;
