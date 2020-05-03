const { validationResult } = require('express-validator');
const Order = require('../models/order');

class OrderController {
  static async findAll(req, res, next) {
    let orders;
    try {
      orders = await Order.find();
    } catch (err) {
      return next({
        msg: 'Fetching orders failed, please try again later.',
        code: 500,
      });
    }

    res.json({
      orders: orders.map((order) => order.toObject({ getters: true })),
    });
  }

  static async getOrderByCustomerId(req, res, next) {
    const customerId = req.params.cid;

    let order;
    try {
      order = await Order.findOne({ customer: customerId });
    } catch (err) {
      return next({
        msg: 'Fetching orders failed, please try again later.',
        code: 500,
      });
    }

    if (!order) {
      return next({
        msg: 'Could not find order for the given customer id.',
        code: 404,
      });
    }

    res.json({ order: order.toObject({ getters: true }) });
  }

  static async create(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({
        msg: 'Invalid inputs passed, please check your data.',
        code: 422,
      });
    }

    const {
      totalPrice,
      customer,
      invoiceDate,
      invoiceNo,
      items,
      status,
    } = req.body;

    const createdOrder = new Order({
      totalPrice,
      customer,
      invoiceDate,
      invoiceNo,
      items,
      status,
    });

    try {
      await createdOrder.save();
    } catch (err) {
      return next({
        msg: 'Creating order failed, please try again.',
        code: 500,
      });
    }

    res.status(201).json({
      order: createdOrder.toObject({ getters: true }),
    });
  }


  static async update(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next({
        msg: 'Invalid inputs passed, please check your data.',
        code: 422,
      });
    }

    const {
      totalPrice, customer, invoiceNo, items, status,
    } = req.body;

    const orderId = req.params.oid;

    let order;
    try {
      order = await Order.findById(orderId);
    } catch (err) {
      return next({
        msg: 'Something went wrong, could not update order.',
        code: 500,
      });
    }

    order = new Order({
      totalPrice,
      customer,
      invoiceNo,
      items,
      status,
    });

    try {
      await order.save();
    } catch (err) {
      return next({
        msg: 'Something went wrong, could not update order.',
        code: 500,
      });
    }

    res.json({ order: order.toObject({ getters: true }) });
  }

  static async delete(req, res, next) {
    const orderId = req.params.oid;
    let order;

    try {
      order = await Order.findById(orderId);
    } catch (err) {
      return next({
        msg: 'Something went wrong, could not delete order.',
        code: 500,
      });
    }

    if (!order) {
      return next({ msg: 'Could not find order for this id.', code: 404 });
    }

    try {
      await order.remove();
    } catch (err) {
      return next({
        msg: 'Something went wrong, could not delete order.',
        code: 500,
      });
    }

    res.json({ msg: 'Deleted order.' });
  }
}

module.exports = OrderController;
