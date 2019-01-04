/** middleware to validate allowed HTTP methods */
function validHTTPMethods(acceptedMethods) {
  return function(req, res, next) {
    if (!acceptedMethods.includes(req.method)) {
      const error = new Error(`${req.method} is not supported at ${req.path}.`);
      error.status = 405;
      return next(error);
    }
    return next();
  };
}

module.exports = validHTTPMethods;
