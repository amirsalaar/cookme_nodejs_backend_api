import { Application } from "express";
import { body } from "express-validator";
import bodyValidationMiddleware from "src/common/middleware/body.validation.middleware";
import { CommonRoutesConfig } from "../common/common.routes.config";
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
        body("email").isEmail(),
        body("password")
          .isLength({ min: 6 })
          .withMessage("Must include password more than six characters"),
        bodyValidationMiddleware.verifyBodyFieldsErrors,
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
      body("email").isEmail(),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Must include password more than six characters"),
      body("firstName").isString(),
      body("lastName").isString(),
      body("permissionFlags").isInt(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      usersMiddleware.validateSameEmailBelongsToSameUser,
      usersController.put,
    ]);

    this.app.patch(this.getAbsolutePath("/users/:userId"), [
      body("email").isEmail().optional(),
      body("password")
        .isLength({ min: 6 })
        .withMessage("Must include password more than six characters")
        .optional(),
      body("firstName").isString().optional(),
      body("lastName").isString().optional(),
      body("permissionFlags").isInt().optional(),
      bodyValidationMiddleware.verifyBodyFieldsErrors,
      usersController.patch,
    ]);

    return this.app;
  }
}
