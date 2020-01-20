const errorHandler = (err, req, res, next) => {
  res.status(400).json({ success: false, error: err.errors[0].message });
};

module.exports = errorHandler;
