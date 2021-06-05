import { CreateUserDto, PatchUserDto, PutUserDto } from "../dtos/";
import shortid from "shortid";
import debug from "debug";

const log: debug.IDebugger = debug("app:in-memory-dao");

class UsersDao {
  users: Array<CreateUserDto> = [];

  constructor() {
    log("Created new instance of UsersDao");
  }

  /**
   *
   * @param user
   * @returns id
   */
  async addUser(user: CreateUserDto): Promise<string> {
    user.id = shortid.generate();
    this.users.push(user);
    return user.id;
  }

  /**
   *
   * @returns Promise<CreateUserDto[]>
   */
  public async getUsers(): Promise<CreateUserDto[]> {
    return this.users;
  }

  /**
   *
   * @param userId
   * @returns
   */
  public async getUserById(userId: string): Promise<CreateUserDto | undefined> {
    return this.users.find((user: { id: string }) => user.id === userId);
  }

  /**
   *
   * @param userId
   * @param user
   * @returns
   */
  public async putUserById(userId: string, user: PutUserDto): Promise<string> {
    const objectIndex = this.users.findIndex(
      (obj: { id: string }) => obj.id === userId,
    );

    this.users.splice(objectIndex, 1, user);
    return `${user.id} updated via put`;
  }

  /**
   *
   * @param userId
   * @param user
   * @returns
   */
  public async patchUserById(
    userId: string,
    user: PatchUserDto,
  ): Promise<string> {
    const objectIndex = this.users.findIndex(
      (obj: { id: string }) => obj.id === userId,
    );

    const currentUser = this.users[objectIndex];

    const allowedPatchFields = [
      "password",
      "firstName",
      "lastName",
      "permissionLevel",
    ];
    for (const field of allowedPatchFields) {
      if (field in user) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        currentUser[field] = user[field];
      }
    }
    return `${user.id} patched`;
  }

  /**
   *
   * @param userId
   * @returns
   */
  public async removeUserById(userId: string): Promise<string> {
    const objectIndex = this.users.findIndex(
      (obj: { id: string }) => obj.id === userId,
    );

    this.users.splice(objectIndex, 1);

    return `${userId} deleted`;
  }

  async getUserByEmail(email: string) {
    const objIndex = this.users.findIndex(
      (obj: { email: string }) => obj.email === email,
    );

    const currentUser = this.users[objIndex];
    if (currentUser) {
      return currentUser;
    }
    return null;
  }
}

export default new UsersDao(); // singleton class
