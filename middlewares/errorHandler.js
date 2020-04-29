const errorHandler = (err, req, res) => {
  res.status(err.code || 500).json({
    msg: err.msg || 'An unknown error occurred!',
  });
};

module.exports = errorHandler;
