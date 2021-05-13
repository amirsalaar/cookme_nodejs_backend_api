import { Router } from "express";
import { UsersController } from "../controllers/UsersController";

const userRoutes = Router();
const userController = new UsersController();

userRoutes.get("/users/:id", userController.getUserById);

export default userRoutes;
