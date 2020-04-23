const { Schema, Types, model } = require('mongoose');

const cartSchema = new Schema({
	customerId: { type: String, required: true },
	createdAtDate: { type: Date, required: true },
	items: [{ type: Types.ObjectId, required: true, ref: 'Item' }],
});

module.exports = model('Cart', cartSchema);
