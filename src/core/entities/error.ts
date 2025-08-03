

/**
 * Error thrown when a requested resource cannot be found.
 */

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }
}
/**
 * Error thrown when a request is malformed or invalid.
 */
export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Error thrown when an authorization failure occurs.
 */
export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 * Error thrown when an internal server error occurs.
 */
export class InternalError extends Error {
  constructor(message: string) {
    super(message);
  }
}




