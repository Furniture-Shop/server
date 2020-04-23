const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const itemSchema = new Schema({
   productId: { type: mongoose.Types.ObjectId, required: true, ref: "Product" },
   quantity: { type: Number, required: true, min: 1 },
});

module.exports = mongoose.model("Item", itemSchema);
