const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const customerSchema = new Schema({
   fullName: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
});

customerSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Customer", customerSchema);
