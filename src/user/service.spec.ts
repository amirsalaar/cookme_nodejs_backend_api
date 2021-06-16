import { UserRepository } from "./interface";
import Service from "./service";

describe("user service", () => {
  const globalRepository: UserRepository = {
    findUserById: jest.fn(),
    addUser: jest.fn(),
    getUsers: jest.fn(),
    updateUserById: jest.fn(),
    removeUserById: jest.fn(),
    getUserByEmail: jest.fn(),
    getUserByEmailWithPassword: jest.fn(),
  };

  describe("getUser", () => {
    it("gets the user from the database", async () => {
      const expected = {
        _id: "random_id_string",
        username: "random username",
        email: "random_email",
        password: "random_pass",
        firstName: "rand_fname",
        lastName: "rand_lname",
        permissionFlags: 1,
        createdAt: Date.now(),
      };

      const repository = {
        ...globalRepository,
        findUserById: jest.fn().mockResolvedValueOnce(expected),
      };

      const service = Service(repository);
      const result = await service.getById("random_id_string");

      expect(result).toMatchObject(expected);
    });
  });

  describe("list users", () => {
    it("returns the list of all users", async () => {
      const expectedUsers = [...Array(10)].map((user, index) => {
        return {
          _id: `random_id_string ${index}`,
          username: `random ${index}`,
          email: `random_email ${index}`,
          password: `random_pass ${index}`,
          firstName: `random_fname ${index}`,
          lastName: `rand_lname ${index}`,
          permissionFlags: Math.ceil(Math.random() * 10),
          createdAt: Date.now(),
        };
      });

      const repository = {
        ...globalRepository,
        getUsers: jest.fn().mockResolvedValueOnce(expectedUsers),
      };

      const service = Service(repository);
      const result = await service.list(10, 0);

      expect(result.length).toEqual(10);
      expect(result).toMatchObject(expectedUsers);
    });
  });
});
