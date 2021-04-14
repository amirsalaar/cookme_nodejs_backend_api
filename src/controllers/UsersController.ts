import { NextFunction, Request, Response } from "express";

export class UsersController {
  /**
   * createUser
   */
  public static async createUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    res.json("Signs Up User");
    next();
  }
}
