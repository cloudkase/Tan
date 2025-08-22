/* Standardized error-handling middleware for Express. Provides notFound and errorHandler. */

// Standard notFound and error-handling middlewares for Express

const notFound = (req, res, next) => {
  const err = new Error('Route Not Found');
  err.status = 404;
  next(err);
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const payload = {
    message: err.message || 'Internal Server Error'
  };
  if (process.env.NODE_ENV !== 'production') {
    payload.stack = err.stack;
  }
  console.error(`[ERROR] ${status} ${payload.message}`);
  res.status(status).json(payload);
};

module.exports = { notFound, errorHandler };
