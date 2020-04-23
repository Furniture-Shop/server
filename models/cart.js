const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
   customerId: { type: String, required: true },
   createdAtDate: { type: Date, required: true },
   items: [{ type: mongoose.Types.ObjectId, required: true, ref: "Item" }],
});

module.exports = mongoose.model("Cart", cartSchema);
