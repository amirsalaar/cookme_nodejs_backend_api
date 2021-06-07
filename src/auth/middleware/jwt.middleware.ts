import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Jwt } from "../../common/types/jwt";
import usersService from "../../users/services/users.service";

// @ts-expect-error JWT_SECRET is an environment variable
const JWT_SECRET: string = process.env.JWT_SECRET;

class JwtMiddleware {
  public verifyRefreshBodyField(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (req.body && req.body.refreshToken) {
      return next();
    } else {
      return res
        .status(400)
        .send({ errors: ["Missing requried field: refreshToken"] });
    }
  }

  /**
   * Verifies if the refresh token is correct for
   * a specific user ID
   * @param req
   * @param res
   * @param next
   * @returns
   */
  public async validRefreshNeeded(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const user: any = await usersService.getUserByEmailWithPassword(
      res.locals.jwt.email,
    );

    const salt = crypto.createSecretKey(
      Buffer.from(res.locals.jwt.refreshKey.data),
    );

    const hash = crypto
      .createHmac("sha512", salt)
      .update(res.locals.jwt.userId + JWT_SECRET)
      .digest("base64");

    if (hash === req.body.refreshToken) {
      req.body = {
        userId: user.id,
        email: user.email,
        permissionFlags: user.permissionFlags,
      };
      return next();
    } else {
      return res.status(400).send({ errors: ["Invalid refresh token"] });
    }
  }

  public validJWTNeeded(req: Request, res: Response, next: NextFunction) {
    if (req.headers["authorization"]) {
      try {
        const authorization = req.headers["authorization"].split(" ");
        if (authorization[0] !== "Bearer") {
          return res.send(400).send();
        }

        res.locals.jwt = jwt.verify(authorization[1], JWT_SECRET) as Jwt;
        next();
      } catch (error) {
        return res.status(403).send();
      }
    } else {
      return res.status(401).send();
    }
  }
}

export default new JwtMiddleware();
