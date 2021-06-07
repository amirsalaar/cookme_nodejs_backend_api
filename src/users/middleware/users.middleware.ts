import usersService from "../services/users.service";
import debug from "debug";
import { Request, Response, NextFunction } from "express";

const log: debug.IDebugger = debug("app:users-middleware");

class UsersMiddleware {
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
      res.status(400).send({ error: "User email already exists" });
    } else {
      next();
    }
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
    if (res.locals.user.id === req.params.userId) {
      next();
    } else {
      res.status(400).send({ error: "Invalid Email" });
    }
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
    if (user) {
      res.locals.user = user;
      return next();
    }

    return res
      .status(404)
      .send({ error: `User id ${req.params.userId} not found` });
  }

  /**
   * exractUserId
   * @param req Request,
   * @param res Response,
   * @param next NextFunction,
   */
  public async extractUserId(req: Request, _res: Response, next: NextFunction) {
    req.body.id = req.params.userId;
    next();
  }

  /**
   * This is to validate if user can change permission flag on update request
   * userCantChangePermission
   */
  public async userCantChangePermission(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (
      "permissionFlags" in req.body &&
      req.body.permissionFlags !== res.locals.user.permissionFlags
    ) {
      return res
        .status(400)
        .send({ errors: ["User cannot change permission flags"] });
    }

    return next();
  }
}

export default new UsersMiddleware();
