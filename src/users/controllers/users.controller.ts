import { Request, Response } from "express";
import debug from "debug";
import bcrypt from "bcrypt";
import usersService from "../users.service";

const log: debug.IDebugger = debug("app:users-controller");

class UsersController {
  async listUsers(req: Request, res: Response) {
    const users = await usersService.list(100, 0);
    res.status(200).send(users);
  }

  async getUserById(req: Request, res: Response) {
    const user = await usersService.getById(req.body.id);
    res.status(200).send(user);
  }

  async createUser(req: Request, res: Response) {
    let { password } = req.body;
    password = await bcrypt.hash(password, 16);

    const userId = await usersService.create(req.body);
    res.status(201).send({ id: userId });
  }

  async patch(req: Request, res: Response) {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 16);
    }
    log(await usersService.patchById(req.body.id, req.body));
    res.status(204).send();
  }

  async put(req: Request, res: Response) {
    req.body.password = await bcrypt.hash(req.body.password, 16);
    log(await usersService.putById(req.body.id, req.body));
    res.status(204).send();
  }

  async removeUser(req: Request, res: Response) {
    log(await usersService.deleteById(req.body.id));
    res.status(204).send();
  }
}

export default new UsersController();
