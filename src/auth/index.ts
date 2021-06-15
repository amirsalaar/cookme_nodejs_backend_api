import { Router } from "express";
import Controller from "./controller";
import mongooseService from "../common/services/mongoose.service";
import usersService from "../user/service";
import usersRepository from "../user/repository";

const auth = (dbService: typeof mongooseService): Router => {
  return Controller(usersService(usersRepository(dbService)));
};

export default auth;
