import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { JwtPayload } from "../../common/types/jwt";
import { UsersService } from "../../user/service";
import { JwtMiddleware } from "../interface";

const JWT_SECRET: string = process.env.JWT_SECRET!;

const jwtMiddleware = (usersService: UsersService): JwtMiddleware => {
  return {
    verifyRefreshBodyField(req: Request, res: Response, next: NextFunction) {
      if (req.body && req.body.refreshToken) {
        next();
        return;
      } else {
        res
          .status(400)
          .send({ errors: ["Missing requried field: refreshToken"] });
        return;
      }
    },

    /**
     * Verifies if the refresh token is correct for
     * a specific user ID
     * @param req
     * @param res
     * @param next
     * @returns
     */
    async validRefreshNeeded(req: Request, res: Response, next: NextFunction) {
      const user: any = await usersService.getUserByEmailWithPassword(
        res.locals.jwtPayload.email,
      );

      const salt = crypto.createSecretKey(
        Buffer.from(res.locals.jwtPayload.refreshKey.data),
      );

      const hash = crypto
        .createHmac("sha512", salt)
        .update(res.locals.jwtPayload.userId + JWT_SECRET)
        .digest("base64");

      if (hash === req.body.refreshToken) {
        req.body = {
          userId: user.id,
          email: user.email,
          permissionFlags: user.permissionFlags,
        };
        next();
        return;
      } else {
        res.status(400).send({ errors: ["Invalid refresh token"] });
        return;
      }
    },

    validJWTNeeded(req: Request, res: Response, next: NextFunction) {
      if (req.headers["authorization"]) {
        try {
          const authorization = req.headers["authorization"].split(" ");
          if (authorization[0] !== "Bearer") {
            res.send(400).send();
            return;
          }

          res.locals.jwtPayload = jwt.verify(
            authorization[1],
            JWT_SECRET,
          ) as JwtPayload;

          next();
        } catch (error) {
          res.status(403).send({ errors: error.message });
          return;
        }
      } else {
        res.status(401).send();
        return;
      }
    },
  };
};

export default jwtMiddleware;
