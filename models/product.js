const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
   name: { type: String, required: true },
   price: { type: Number, required: true, min: 0 },
   material: { type: String, required: true },
   dimensions: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema);
