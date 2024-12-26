/**
 * Catches async errors and passes them to the next middleware.
 * @param {Function} fn - The async function to wrap
 * @returns {Function} A new function that wraps the original function
 * @example
 * const myAsyncFunction = async (req, res, next) => {
 *   // async code here
 * }
 *
 * const wrappedFunction = CatchAsyncErrors(myAsyncFunction);
 *
 * // Call the wrapped function
 * wrappedFunction(req, res, next);
 */
const CatchAsyncErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

class AppError extends Error {
  /**
   * Constructor for AppError
   * @param {string} message - The error message
   * @param {number} statusCode - The HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export { CatchAsyncErrors, AppError };