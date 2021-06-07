import { CRUD } from "../../common/interfaces/crud.interface";
import usersDao from "../daos/users.dao";
import { CreateUserDto, PatchUserDto, PutUserDto } from "../dtos";

class UsersService implements CRUD {
  async create(resource: CreateUserDto) {
    return usersDao.addUser(resource);
  }

  async deleteById(id: string) {
    return usersDao.removeUserById(id);
  }

  async list(limit: number, page: number) {
    return usersDao.getUsers(limit, page);
  }

  async patchById(id: string, resource: PatchUserDto) {
    return usersDao.updateUserById(id, resource);
  }

  async getById(id: string) {
    return usersDao.getUserById(id);
  }

  async putById(id: string, resource: PutUserDto) {
    return usersDao.updateUserById(id, resource);
  }

  async getUserByEmail(email: string) {
    return usersDao.getUserByEmail(email);
  }

  async getUserByEmailWithPassword(email: string) {
    return usersDao.getUserByEmailWithPassword(email);
  }
}

export default new UsersService();
