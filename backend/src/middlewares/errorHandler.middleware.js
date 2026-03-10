let _logger = null;
function getLogger() {
  if (!_logger) {
    try { _logger = require('../utils/logger').logger; } catch { _logger = console; }
  }
  return _logger;
}

/**
 * Global error handler middleware
 */
function errorHandler(err, req, res, next) {
  const logger = getLogger();
  const statusCode = err.statusCode || err.status || 500;

  // Логируем 5xx как ошибки, 4xx как предупреждения
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} — ${err.message}`, { stack: err.stack, status: statusCode });
  } else if (statusCode >= 400 && !err.isJoi) {
    logger.warn(`${req.method} ${req.originalUrl} — ${err.message}`, { status: statusCode });
  }

  // Joi validation error
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Validation error',
      details: err.details.map(d => d.message)
    });
  }

  // Supabase error
  if (err.code && err.message) {
    // PostgreSQL unique violation
    if (err.code === '23505') {
      return res.status(409).json({
        error: 'Resource already exists'
      });
    }

    // PostgreSQL foreign key violation
    if (err.code === '23503') {
      return res.status(400).json({
        error: 'Referenced resource not found'
      });
    }

    // Supabase PGRST errors
    if (err.code === 'PGRST116') {
      return res.status(404).json({
        error: 'Resource not found'
      });
    }
  }

  // Custom application errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  // Default server error
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(statusCode).json({
    error: message
  });
}

/**
 * Custom application error class
 */
class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async handler wrapper
 * Wraps async route handlers to catch errors
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  errorHandler,
  AppError,
  asyncHandler
};
