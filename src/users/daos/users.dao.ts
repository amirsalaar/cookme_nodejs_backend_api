import shortid from "shortid";
import debug from "debug";
import { CreateUserDto, PatchUserDto, PutUserDto } from "../dtos/";
import mongooseService from "src/common/services/mongoose.service";

const log: debug.IDebugger = debug("app:in-memory-dao");

class UsersDao {
  users: Array<CreateUserDto> = [];

  Schema = mongooseService.getMongoose.Schema;

  /**
   * select: false in the @field password will hide this
   * field when returning a user or list of the users
   */
  userSchema = new this.Schema(
    {
      _id: String,
      email: String,
      password: { type: String, select: false },
      firstName: String,
      lastName: String,
      permissionFlags: Number,
    },
    { id: false },
  );

  User = mongooseService.getMongoose.model("Users", this.userSchema);

  constructor() {
    log("Created new instance of UsersDao");
  }
}

export default new UsersDao(); // singleton class
