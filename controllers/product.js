const { validationResult } = require('express-validator');
const Product = require('../models/product');

class ProductController {
  static async findAll(req, res, next) {
    let products;
    try {
      products = await Product.find();
    } catch (err) {
      return next({
        msg: 'Fetching products failed, please try again later.',
        code: 500,
      });
    }

    res.json({
      products: products.map((product) => product.toObject({ getters: true })),
    });
  }

  static async findById(req, res, next) {
    const productId = req.params.pid;

    let product;
    try {
      product = await Product.findById(productId);
    } catch (err) {
      return next({
        msg: 'Something went wrong, could not find a product.',
        code: 500,
      });
    }

    if (!product) {
      return next({
        msg: 'Could not find a product for the provided id.',
        code: 404,
      });
    }

    res.json({ product: product.toObject({ getters: true }) });
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
      name, price, color, dimensions,
    } = req.body;

    const createdProduct = new Product({
      name,
      price,
      color,
      dimensions,
    });

    try {
      await createdProduct.save();
    } catch (err) {
      return next({
        msg: 'Creating product failed, please try again.',
        code: 500,
      });
    }

    res.status(201).json({
      product: createdProduct.toObject({ getters: true }),
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
      name, price, color, dimensions,
    } = req.body;
    const productId = req.params.pid;

    let product;
    try {
      product = await Product.findById(productId);
    } catch (err) {
      return next({
        msg: 'Something went wrong, could not update product.',
        code: 500,
      });
    }

    product.name = name;
    product.price = price;
    product.color = color;
    product.dimensions = dimensions;

    try {
      await product.save();
    } catch (err) {
      return next({
        msg: 'Something went wrong, could not update product.',
        code: 500,
      });
    }

    res.json({ product: product.toObject({ getters: true }) });
  }

  static async deleteProduct(req, res, next) {
    const productId = req.params.pid;

    let product;
    try {
      product = await Product.findById(productId);
    } catch (err) {
      return next({
        msg: 'Something went wrong, could not delete product.',
        code: 500,
      });
    }

    if (!product) {
      return next({ msg: 'Could not find product for this id.', code: 404 });
    }

    try {
      await product.remove();
    } catch (err) {
      return next({
        msg: 'Something went wrong, could not delete product.',
        code: 500,
      });
    }

    res.json({ msg: 'Deleted product.' });
  }
}

module.exports = ProductController;
