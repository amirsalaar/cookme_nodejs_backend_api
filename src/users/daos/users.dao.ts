import { CreateUserDto, PatchUserDto, PutUserDto } from "../dtos/";
import shortid from "shortid";
import debug from "debug";

const log: debug.IDebugger = debug("app:in-memory-dao");

class UsersDao {
  users: Array<CreateUserDto> = [];

  constructor() {
    log("Created new instance of UsersDao");
  }
}

export default new UsersDao(); // singleton class
