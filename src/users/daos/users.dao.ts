import shortid from "shortid";
import debug from "debug";
import { CreateUserDto, PatchUserDto, PutUserDto } from "../dtos/";
import mongooseService from "../../common/services/mongoose.service";
import { PermissionFlag } from "../../common/middleware/common.permissionflag.enum";

const log: debug.IDebugger = debug("app:in-memory-dao");

class UsersDao {
  users: Array<CreateUserDto> = [];

  Schema = mongooseService.getMongoose.Schema;

  /**
   * select: false in the @field password will hide this
   * field when returning a user or list of the users
   * { id: false } deactivates id getter offered by mongoose
   */
  userSchema = new this.Schema({
    _id: String,
    email: String,
    password: { type: String, select: false },
    firstName: String,
    lastName: String,
    permissionFlag: Number,
  });

  User = mongooseService.getMongoose.model("Users", this.userSchema);

  constructor() {
    log("Created new instance of UsersDao");
  }

  /**
   * addUser
   * @param {CreateUserDto} userFields
   * @return {Promise<string>} userId
   */
  public async addUser(userFields: CreateUserDto): Promise<string> {
    const userId = shortid.generate();
    const user = new this.User({
      _id: userId,
      ...userFields,
      permissionFlag: PermissionFlag.BASE_PERMISSION,
    });
    await user.save();
    return userId;
  }

  /**
   * getUserById
   * @param {string} userId
   */
  public async getUserById(userId: string) {
    return this.User.findOne({ _id: userId }).populate("User").exec();
  }

  /**
   * getUsers
   * @param {Number} limit
   * @param {Number} page
   */
  public async getUsers(limit = 25, page = 0) {
    return this.User.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  /**
   * getUserByEmail
   */
  public async getUserByEmail(email: string) {
    return this.User.findOne({ email }).exec();
  }

  /**
   * PUT and PATCH request will be using the same method
   * for updating the resource due to mongoose findOneAndUpdate()
   * function being able to update the entire document or just part
   * of it
   * @param {string} userId
   * @param {PatchUserDto | PutUserDto} userFields
   */
  public async updateUserById(
    userId: string,
    userFields: PatchUserDto | PutUserDto,
  ) {
    const existingUser = await this.User.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true },
    ).exec();

    return existingUser;
  }

  /**
   * removeUserById
   * @param {string} userId
   */
  public async removeUserById(userId: string) {
    return this.User.deleteOne({ _id: userId }).exec();
  }

  /**
   * getUserByEmailWithPassword
   * @param {string} email
   */
  public async getUserByEmailWithPassword(email: string) {
    return this.User.findOne({ email })
      .select("_id email permissionFlag +password")
      .exec();
  }
}

export default new UsersDao(); // singleton class
