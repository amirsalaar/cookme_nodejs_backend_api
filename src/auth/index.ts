import Controller from "./auth.controller";
import mongooseService from "src/common/services/mongoose.service";
import usersService from "src/user/service";
import usersRepository from "src/user/repository";

const auth = (dbService: typeof mongooseService) => {
  return Controller(usersService(usersRepository(dbService)));
};

export default auth;
