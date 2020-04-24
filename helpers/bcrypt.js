const bcrypt = require('bcrypt');
const saltRounds = 10;

async function hashPassword(password) {
	try {
		const hash = await bcrypt.hash(password, saltRounds);
		return { success: true, hash };
	} catch (e) {
		return { success: false };
	}
}

async function comparePassword(password, hashedPassword) {
	try {
		const match = await bcrypt.compare(password, hashedPassword);
		return match;
	} catch (e) {
		return false;
	}
}

module.exports = { hashPassword, comparePassword };
