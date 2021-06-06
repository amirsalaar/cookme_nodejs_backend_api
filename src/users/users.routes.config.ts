import { CommonRoutesConfig } from "../common/common.routes.config";
import { Application, NextFunction, Request, Response } from "express";
import usersController from "./controllers/users.controller";
import usersMiddleware from "./middleware/users.middleware";

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "UsersRoutes");
  }

  public configureRoutes(): Application {
    this.app
      .route("/users")
      .get(usersController.listUsers)
      .post(
        usersMiddleware.validateRequiredUserBodyFields,
        usersMiddleware.validateSameEmailDoesntExist,
        usersController.createUser,
      );

    this.app.param("userId", usersMiddleware.extractUserId);

    this.app.route("/users/:userId").all(usersMiddleware.validateUserExists);

    this.app
      .route("/users/:userId")
      .get(usersController.getUserById)
      .delete(usersController.removeUser);

    this.app.put("/users/:userId", [
      usersMiddleware.validateRequiredUserBodyFields,
      usersMiddleware.validateSameEmailBelongsToSameUser,
      usersController.put,
    ]);

    this.app.patch("/users/:userId", [
      usersMiddleware.validatePatchEmail,
      usersController.patch,
    ]);

    return this.app;
  }
}
