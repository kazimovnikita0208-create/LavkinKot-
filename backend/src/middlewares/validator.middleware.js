const { AppError } = require('./errorHandler.middleware');

/**
 * Middleware для валидации request body
 * @param {Object} schema - Joi schema
 */
function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const messages = error.details.map(d => d.message).join(', ');
      throw new AppError(`Validation error: ${messages}`, 400);
    }
    
    req.body = value;
    next();
  };
}

/**
 * Middleware для валидации query params
 * @param {Object} schema - Joi schema
 */
function validateQuery(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const messages = error.details.map(d => d.message).join(', ');
      throw new AppError(`Validation error: ${messages}`, 400);
    }
    
    req.query = value;
    next();
  };
}

/**
 * Middleware для валидации params
 * @param {Object} schema - Joi schema
 */
function validateParams(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const messages = error.details.map(d => d.message).join(', ');
      throw new AppError(`Validation error: ${messages}`, 400);
    }
    
    req.params = value;
    next();
  };
}

module.exports = {
  validateBody,
  validateQuery,
  validateParams
};
