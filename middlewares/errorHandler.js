const errorHandler = (err, req, res, next) => {
	res.status(err.code || 500).json({
		msg: err.msg || 'An unknown error occurred!',
	});
};

module.exports = errorHandler;
