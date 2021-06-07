import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

/**
 * @class This middleware is going to simplify the errors
 * thrown when validating body
 */
class BodyValidationMiddleware {
  verifyBodyFieldsErrors(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    next();
  }
}

export default new BodyValidationMiddleware();
