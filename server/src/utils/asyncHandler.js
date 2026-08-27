// Express 4 does not catch rejected promises from async handlers,
// so every async controller is wrapped with this.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
