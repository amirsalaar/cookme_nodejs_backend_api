import { Request, Response } from "express";
import { UserService } from "../users.service";

export class UsersController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  /**
   * getUserById
   * @param req {Request}
   * @param res {Response}
   */
  public getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.service.getUserById(parseInt(id));

      if (result === null) res.status(404).send();
      else res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
