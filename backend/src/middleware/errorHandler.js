/**
 * Centralized Error Handling Middleware
 * Catches all errors thrown in controllers/services and returns consistent error responses
 */
const errorHandler = (err, req, res, next) => {
  console.error('🔴 Error:', err.message);
  console.error('Stack:', err.stack);

  // Determine status code
  const statusCode = err.statusCode || 500;

  // Send consistent error response
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

/**
 * Custom AppError class for operational errors
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorHandler, AppError };
