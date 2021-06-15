import { NextFunction, Request, Response } from "express";

export interface AuthMiddleware {
  verifyUserPassword: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}

export interface JwtMiddleware {
  verifyRefreshBodyField: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
  validRefreshNeeded: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  validJWTNeeded: (req: Request, res: Response, next: NextFunction) => void;
}
