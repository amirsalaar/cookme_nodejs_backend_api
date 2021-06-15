import { UsersService } from "./service";
import debug from "debug";
import { Request, Response, NextFunction } from "express";

const log: debug.IDebugger = debug("app:users-middleware");

export interface UsersMiddleware {
  validateSameEmailDoesntExist: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  validateSameEmailBelongsToSameUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
  validatePatchEmail: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<any>;
  validateUserExists: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  extractUserId: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  userCantChangePermission: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}

const usersMiddleware = (usersService: UsersService): UsersMiddleware => {
  const validateSameEmailBelongsToSameUser = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    if (res.locals.user.id === req.params.userId) {
      next();
    } else {
      res.status(400).send({ error: "Invalid Email" });
    }
  };

  return {
    async validateSameEmailDoesntExist(
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
    },

    validateSameEmailBelongsToSameUser(
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      return validateSameEmailBelongsToSameUser(req, res, next);
    },

    /**
     * Since PATCH will update only some fields in the target resource,
     * if email is one of the parameters that needs to be updated, its existance
     * needs to be validated
     * @param req Request,
     * @param res Response,
     * @param next NextFunction,
     */
    async validatePatchEmail(req: Request, res: Response, next: NextFunction) {
      if (req.body.email) {
        log("Validating email", req.body.email);
        return validateSameEmailBelongsToSameUser(req, res, next);
      }

      next();
    },

    async validateUserExists(req: Request, res: Response, next: NextFunction) {
      const user = await usersService.getById(req.params.userId);
      if (user) {
        res.locals.user = user;
        next();
        return;
      }

      res.status(404).send({ error: `User id ${req.params.userId} not found` });
    },

    async extractUserId(req: Request, _res: Response, next: NextFunction) {
      req.body.id = req.params.userId;
      next();
    },

    /**
     * This is to validate if user can change permission flag on update request
     * userCantChangePermission
     */
    async userCantChangePermission(
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      if (
        "permissionFlags" in req.body &&
        req.body.permissionFlags !== res.locals.user.permissionFlags
      ) {
        res
          .status(400)
          .send({ errors: ["User cannot change permission flags"] });
        return;
      }

      next();
    },
  };
};

export default usersMiddleware;
