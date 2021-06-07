import { PermissionFlag } from "./common.permissionflag.enum";
import debug, { IDebugger } from "debug";
import { NextFunction, Request, Response } from "express";

const log: IDebugger = debug("app:app:common-permission-middleware");

class CommonPermissionMiddleware {
  /**
   * Factory method to generate middleware for Permission Flags
   * @param {PermissionFlag} requiredPermissionFlag
   * @returns a request handler
   */
  public permissionFlagRequired(requiredPermissionFlag: PermissionFlag) {
    return (_req: Request, res: Response, next: NextFunction) => {
      try {
        const userPermissionFlags = parseInt(
          res.locals.jwtPayload.permissionFlags,
        );
        if (userPermissionFlags & requiredPermissionFlag) {
          next();
        } else {
          res.status(403).send();
        }
      } catch (err) {
        log(err);
      }
    };
  }

  public async onlySameUserOrAdminCanDoThisAction(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const userPermissionFlags = parseInt(res.locals.permissionFlags);
    if (
      req.params &&
      req.params.userId &&
      req.params.userId === res.locals.jwtPayload.userId
    ) {
      return next();
    } else {
      if (userPermissionFlags & PermissionFlag.ADMIN_PERMISSION) {
        return next();
      } else {
        return res.status(403).send();
      }
    }
  }
}

export default new CommonPermissionMiddleware();
