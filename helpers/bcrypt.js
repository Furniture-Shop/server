const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashPassword = async (password) => {
	try {
		const hash = await bcrypt.hash(password, saltRounds);
		return { success: true, hash };
	} catch (e) {
		return { success: false };
	}
};

const comparePassword = async (password, hashedPassword) => {
	try {
		const match = await bcrypt.compare(password, hashedPassword);
		return match;
	} catch (e) {
		return false;
	}
};

module.exports = { hashPassword, comparePassword };
