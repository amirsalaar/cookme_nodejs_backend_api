import { Router } from "express";
import { UsersController } from "../controllers/UsersController";

const userRoutes = Router();
const userController = new UsersController();

userRoutes.get("/users", userController.getUsers);

export default userRoutes;
