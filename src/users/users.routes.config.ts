import { CommonRoutesConfig } from "../common/common.routes.config";
import express, { NextFunction, Request, Response } from "express";

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UsersRoutes");
  }

  public configureRoutes(): express.Application {
    this.app
      .route("/users")
      .get((_req: Request, res: Response) => {
        res.status(200).send("List of users");
      })
      .post((_req: Request, res: Response) => {
        res.status(201).send("Post to users");
      });

    this.app
      .route("/users/:userId")
      .all((_req: Request, _res: Response, next: NextFunction) => {
        /**
         * this middleware will be run before any request to this endpoint
         */
        next();
      })
      .get((req: Request, res: Response) => {
        res.status(200).send(`GET requested for id ${req.params.id}`);
      })
      .put((req: Request, res: Response) => {
        res.status(201).send(`PUT requested for id ${req.params.id}`);
      })
      .patch((req: Request, res: Response) => {
        res.status(201).send(`PATCH requested for id ${req.params.id}`);
      })
      .delete((req: Request, res: Response) => {
        res.status(201).send(`DELETE requested for id ${req.params.id}`);
      });

    return this.app;
  }
}
