const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const customerSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

customerSchema.plugin(uniqueValidator);

module.exports = model('Customer', customerSchema);
