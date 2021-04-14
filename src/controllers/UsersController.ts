import { NextFunction, Request, Response } from "express";
import UserService from "../services/UserService";

export class UsersController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }
  /**
   * getUsers
   */
  public getUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = this.service.getUsers();

      res.json(result);
      next();
    } catch (error) {
      res.json({ error: error.message });
    }
  };
}
