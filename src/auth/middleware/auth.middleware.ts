import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import usersService from "../../users/services/users.service";

class AuthMiddleware {
  /**
   * verifyUserPassword
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  public async verifyUserPassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
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
  }
}

export default new AuthMiddleware();
