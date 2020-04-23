const errorHandler = (err, res, res, next) => {
   res.status(err.code || 500).json({
      msg: err.msg || "An unknown error occurred!",
   });
};

module.exports = errorHandler;
