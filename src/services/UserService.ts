import User from "../models/User";

export default class UserService {
  private userModel: User;
  constructor() {
    this.userModel = new User();
  }

  /**
   * getUsers
   */
  public async getUsers(): Promise<User[]> {
    try {
      const users = await this.userModel.findAll();
      return users.rows;
    } catch (error) {
      throw error;
    }
  }
}
