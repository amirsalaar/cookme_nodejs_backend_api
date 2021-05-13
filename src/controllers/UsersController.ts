import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UsersController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  /**
   * getUserById
   * @param req {Request}
   * @param res {Response}
   * @param next {NextFunction}
   */
  public getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.service.getUserById(parseInt(id));

      if (result === null) res.status(404).send();
      else res.status(200).json(result);

      next();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
