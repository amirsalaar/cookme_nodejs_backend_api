import { User } from "src/types/User";
import { UserRepository } from "../models";

export class UserService {
  private userRepo: UserRepository;
  constructor() {
    this.userRepo = new UserRepository();
  }

  // /**
  //  * getUsers
  //  */
  // public async getUsers(): Promise<User[]> {
  //   try {
  //     const users = await this.userRepo.findAll();
  //     return users.rows;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  /**
   * getUserById
   * @param id {number}
   */
  public async getUserById(id: number): Promise<User> {
    try {
      return await this.userRepo.getUserById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
