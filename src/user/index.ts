import { Router } from "express";
import Controller from "./controller";
import Service from "./service";
import Repository from "./repository";
import mongooseService from "../common/services/mongoose.service";

const user = (dbService: typeof mongooseService): Router => {
  return Controller(Service(Repository(dbService)));
};

export default user;
