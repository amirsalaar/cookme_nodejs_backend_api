import { CRUD } from "../common/interfaces/crud.interface";
import { CreateUserDto, PatchUserDto, PutUserDto } from "./dtos";
import { UserRepository } from "./interface";

export interface UsersService extends CRUD {
  getUserByEmail: (email: string) => Promise<any>;
  getUserByEmailWithPassword: (email: string) => Promise<any>;
}

const usersService = (usersRepository: UserRepository): UsersService => {
  return {
    async create(resource: CreateUserDto) {
      return usersRepository.addUser(resource);
    },

    async deleteById(id: string) {
      return usersRepository.removeUserById(id);
    },

    async list(limit: number, page: number) {
      return usersRepository.getUsers(limit, page);
    },

    async patchById(id: string, resource: PatchUserDto) {
      return usersRepository.updateUserById(id, resource);
    },

    async getById(id: string) {
      return usersRepository.findUserById(id);
    },

    async putById(id: string, resource: PutUserDto) {
      return usersRepository.updateUserById(id, resource);
    },

    async getUserByEmail(email: string) {
      return usersRepository.getUserByEmail(email);
    },

    async getUserByEmailWithPassword(email: string) {
      return usersRepository.getUserByEmailWithPassword(email);
    },
  };
};

export default usersService;
