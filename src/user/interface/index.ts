import { NextFunction, Request, Response } from "express";
import { CreateUserDto, PatchUserDto, PutUserDto } from "../dtos";
export * from "./user.types";

export interface UsersMiddleware {
  validateSameEmailDoesntExist: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  validateSameEmailBelongsToSameUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
  validatePatchEmail: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<any>;
  validateUserExists: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  extractUserId: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  userCantChangePermission: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}

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
