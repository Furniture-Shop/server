const { Schema, model, Types } = require('mongoose');

const itemSchema = new Schema({
	productId: { type: Types.ObjectId, required: true, ref: 'Product' },
	cartId: { type: Types.ObjectId, required: true, ref: 'Cart' },
	quantity: { type: Number, required: true, min: 1 },
});

module.exports = model('Item', itemSchema);
