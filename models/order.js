const { Schema, model, Types } = require('mongoose');

const orderSchema = new Schema({
  totalPrice: { type: Number, required: true },
  customer: { type: String, required: true },
  invoiceDate: { type: Date, default: Date.now },
  invoiceNo: { type: Number, required: true, min: 0 },
  items: [{ type: Types.ObjectId, required: true, ref: 'Product' }],
  status: { type: String, require: true },
});

module.exports = model('Order', orderSchema);
