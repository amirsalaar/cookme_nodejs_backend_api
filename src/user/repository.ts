import shortid from "shortid";
import { CreateUserDto, PatchUserDto, PutUserDto } from "./dtos";
import mongooseService from "../common/services/mongoose.service";
import { PermissionFlag } from "../common/middleware/common.permissionflag.enum";

export interface UserRepository {
  addUser: (userFields: CreateUserDto) => Promise<string>;
  getUserById: (userId: string) => Promise<string>;
  getUsers: (limit: number, page: number) => Promise<any>;
  updateUserById: (
    userId: string,
    userFields: PatchUserDto | PutUserDto,
  ) => Promise<string>;
  removeUserById: (userId: string) => Promise<any>;
  getUserByEmail: (email: string) => Promise<string>;
  getUserByEmailWithPassword: (email: string) => Promise<string>;
}

const repository = (dbService: typeof mongooseService): UserRepository => {
  const { Schema } = dbService.getMongoose;
  /**
   * select: false in the @field password will hide this
   * field when returning a user or list of the users
   * { id: false } deactivates id getter offered by mongoose
   */
  const userSchema = new Schema({
    _id: String,
    email: String,
    password: { type: String, select: false },
    firstName: String,
    lastName: String,
    permissionFlag: Number,
  });

  const User =
    dbService.getMongoose.models.Users ||
    dbService.getMongoose.model("Users", userSchema);

  return {
    /**
     * addUser
     * @param {CreateUserDto} userFields
     * @return {Promise<string>} userId
     */
    async addUser(userFields: CreateUserDto): Promise<string> {
      const userId = shortid.generate();
      const user = new User({
        _id: userId,
        ...userFields,
        permissionFlag: PermissionFlag.BASE_PERMISSION,
      });
      await user.save();
      return userId;
    },

    /**
     * getUserById
     * @param {string} userId
     */
    async getUserById(userId: string) {
      return User.findOne({ _id: userId }).populate("User").exec();
    },

    /**
     * getUsers
     * @param {Number} limit
     * @param {Number} page
     */
    async getUsers(limit = 25, page = 0) {
      return User.find()
        .limit(limit)
        .skip(limit * page)
        .exec();
    },

    /**
     * getUserByEmail
     */
    async getUserByEmail(email: string) {
      return User.findOne({ email }).exec();
    },

    /**
     * PUT and PATCH request will be using the same method
     * for updating the resource due to mongoose findOneAndUpdate()
     * function being able to update the entire document or just part
     * of it
     * @param {string} userId
     * @param {PatchUserDto | PutUserDto} userFields
     */
    async updateUserById(
      userId: string,
      userFields: PatchUserDto | PutUserDto,
    ) {
      const existingUser = await User.findOneAndUpdate(
        { _id: userId },
        { $set: userFields },
        { new: true },
      ).exec();

      return existingUser;
    },

    /**
     * removeUserById
     * @param {string} userId
     */
    async removeUserById(userId: string) {
      return User.deleteOne({ _id: userId }).exec();
    },

    /**
     * getUserByEmailWithPassword
     * @param {string} email
     */
    async getUserByEmailWithPassword(email: string) {
      return User.findOne({ email })
        .select("_id email permissionFlag +password")
        .exec();
    },
  };
};

export default repository;
