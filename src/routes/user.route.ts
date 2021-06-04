import { Router } from "express";
import auth from "../middlewares/auth.middleware";
import { UsersController } from "../controllers/users.controller";

const userRoutes = Router();
const userController = new UsersController();

userRoutes.get("/users/:id", auth, userController.getUserById);

export default userRoutes;
