const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  color: { type: String, required: true },
  dimensions: { type: String, required: true },
});

module.exports = model('Product', productSchema);
