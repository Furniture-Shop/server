const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { hashPassword } = require("../helpers/bcrypt");

const customerSchema = new Schema({
   fullName: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
});

customerSchema.plugin(uniqueValidator);

// Returned an error, hashed in the controller and everything is working
/*customerSchema.pre('save', function (next) { 
	const data = hashPassword(this.password);
	if (data.success) next();
	else next('Failed to hash before saving');
});*/

module.exports = model("Customer", customerSchema);
