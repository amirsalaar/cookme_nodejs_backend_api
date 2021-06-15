import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { UsersService } from "../../user/service";
import { AuthMiddleware } from "../interface";

const authMiddleware = (usersService: UsersService): AuthMiddleware => {
  return {
    async verifyUserPassword(req: Request, res: Response, next: NextFunction) {
      const user: any = await usersService.getUserByEmailWithPassword(
        req.body.email,
      );

      if (user) {
        const passwordHash = user.password;
        if (await bcrypt.compare(req.body.password, passwordHash)) {
          req.body = {
            userId: user.id,
            email: user.email,
            permissionFlags: user.permissionFlags,
          };

          return next();
        }
      }

      res.status(400).send({ errors: ["Invalid email and/or password"] });
    },
  };
};

export default authMiddleware;
