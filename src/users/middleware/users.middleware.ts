import usersService from "../services/users.service";
import debug from "debug";
import { Request, Response, NextFunction } from "express";

const log: debug.IDebugger = debug("app:users-middleware");

class UsersMiddleware {
  /**
   * validateREquiredUserBodyFields
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
   * validatePatchEmail
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
   */
  public async exractUserId(req: Request, res: Response, next: NextFunction) {
    req.body.id = req.params.userId;
    next();
  }
}

export default new UsersMiddleware();
