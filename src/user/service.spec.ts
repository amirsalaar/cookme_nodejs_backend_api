import { UserRepository } from "./interface";
import Service from "./service";

describe("user service", () => {
  let globalRepository: UserRepository;

  describe("getUser", () => {
    beforeAll(() => {
      globalRepository = {
        findUserById: jest.fn(),
        addUser: jest.fn(),
        getUsers: jest.fn(),
        updateUserById: jest.fn(),
        removeUserById: jest.fn(),
        getUserByEmail: jest.fn(),
        getUserByEmailWithPassword: jest.fn(),
      };
    });
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
});
