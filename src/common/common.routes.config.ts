import express from "express";

export abstract class CommonRoutesConfig {
  app: express.Application;
  name: string;
  nameSpace: string | undefined;

  constructor(app: express.Application, name: string, nameSpace?: string) {
    this.app = app;
    this.name = name;
    this.nameSpace = nameSpace;
    this.configureRoutes();
  }

  public getName() {
    return this.name;
  }

  protected getAbsolutePath(path: string): string {
    return this.nameSpace ? this.nameSpace.concat(path) : path;
  }

  public abstract configureRoutes(): express.Application;
}
