import usersService from "../services/users.service";
import debug from "debug";
import { Request, Response, NextFunction } from "express";

const log: debug.IDebugger = debug("app:users-middleware");

class UsersMiddleware {
  /**
   * validateREquiredUserBodyFields
   * @param req Request,
   * @param res Response,
   * @param next NextFunction,
   */
  public async validateRequiredUserBodyFields(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (!req.body && !req.body.email && !req.body.password) {
      return res.status(400).send({
        error: "Missing required fields for email and password",
      });
    }

    next();
  }

  /**
   * validateSameEmailDoesntExist
   * @param req Request,
   * @param res Response,
   * @param next NextFunction,
   */
  public async validateSameEmailDoesntExist(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const user = await usersService.getUserByEmail(req.body.email);
    if (user) {
      return res.status(400).send({ error: "User email already exists" });
    }

    next();
  }

  /**
   * validateSameEmailBelongsToSameUser
   * @param req Request,
   * @param res Response,
   * @param next NextFunction,
   */
  public async validateSameEmailBelongsToSameUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const user = await usersService.getUserByEmail(req.body.email);
    if (user && user.id === req.params.id) {
      return next();
    }

    res.status(400).send({ error: "Invalid Email" });
  }

  /**
   * Since PATCH will update only some fields in the target resource,
   * if email is one of the parameters that needs to be updated, its existance
   * needs to be validated
   * @param req Request,
   * @param res Response,
   * @param next NextFunction,
   */
  public validatePatchEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (req.body.email) {
      log("Validating email", req.body.email);
      return this.validateSameEmailBelongsToSameUser(req, res, next);
    }

    next();
  };

  /**
   * validateUserExists
   * @param req Request,
   * @param res Response,
   * @param next NextFunction,
   */
  public async validateUserExists(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const user = await usersService.getById(req.params.userId);
    if (!user) {
      return res
        .status(404)
        .send({ error: `User id ${req.params.userId} not found` });
    }

    next();
  }

  /**
   * exractUserId
   * @param req Request,
   * @param res Response,
   * @param next NextFunction,
   */
  public async extractUserId(req: Request, res: Response, next: NextFunction) {
    req.body.id = req.params.userId;
    next();
  }
}

export default new UsersMiddleware();
