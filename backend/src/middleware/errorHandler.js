/**
 * Error handling middleware for Express.
 */

function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${err.message}`);

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
}

function notFound(req, res) {
  return res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.url} not found.`,
  });
}

module.exports = { errorHandler, notFound };
