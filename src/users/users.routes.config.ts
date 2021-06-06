import { CommonRoutesConfig } from "../common/common.routes.config";
import { Application } from "express";
import usersController from "./controllers/users.controller";
import usersMiddleware from "./middleware/users.middleware";

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: Application, nameSpace: string | undefined = "/api/v2") {
    super(app, "UsersRoutes", nameSpace);
  }

  public configureRoutes(): Application {
    this.app
      .route(this.getAbsolutePath("/users"))
      .get(usersController.listUsers)
      .post(
        usersMiddleware.validateRequiredUserBodyFields,
        usersMiddleware.validateSameEmailDoesntExist,
        usersController.createUser,
      );

    this.app.param("userId", usersMiddleware.extractUserId);

    this.app
      .route(this.getAbsolutePath("/users/:userId"))
      .all(usersMiddleware.validateUserExists);

    this.app
      .route(this.getAbsolutePath("/users/:userId"))
      .get(usersController.getUserById)
      .delete(usersController.removeUser);

    this.app.put(this.getAbsolutePath("/users/:userId"), [
      usersMiddleware.validateRequiredUserBodyFields,
      usersMiddleware.validateSameEmailBelongsToSameUser,
      usersController.put,
    ]);

    this.app.patch(this.getAbsolutePath("/users/:userId"), [
      usersMiddleware.validatePatchEmail,
      usersController.patch,
    ]);

    return this.app;
  }
}
