import { Knex } from "knex";
import { setupTestDatabase, resetTestDatabase } from "../../../db/dbHelpers";
import { UserService } from "../../../services";
import { User } from "../../../models";
import { IUser } from "../../../types";

describe("UserService.getUserById", () => {
  let dbInstance: Knex<any, unknown[]>;
  let userService: UserService;

  beforeEach(async () => {
    dbInstance = await setupTestDatabase();
    userService = new UserService();
  });

  afterEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => await dbInstance.destroy());

  it("should return a user", async () => {
    const fakeUser = new User();

    const data = {
      firstName: "Joe",
      lastName: "Biden",
      email: "joe@biden.com",
      username: "joebiden",
      passwordDigest: "123456",
      role: 1,
      id: 1,
      createdAt: null,
      updatedAt: null,
      phoneNumber: null,
      address: null,
    };

    Object.entries(fakeUser).forEach((entry) => {
      fakeUser[entry[0]] = data[entry[0]];
    });

    await dbInstance
      .insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        username: data.username,
        password_digest: data.passwordDigest,
        role: data.role,
      })
      .into("users")
      .returning("*");

    const actual = await dbInstance.raw(
      'select * from "users" u where u.id = 1',
    );

    const expected: IUser = await userService.getUserById(1);
    expected.createdAt = null;
    expected.updatedAt = null;

    expect(fakeUser).toStrictEqual(expected);
  });

  it("database state should change after adding the user", async () => {
    const data = {
      firstName: "Joe",
      lastName: "Biden",
      email: "joe@biden.com",
      username: "joebiden",
      passwordDigest: "123456",
      role: 1,
    };

    const dbUserCountsBefore = await getAllUsersCount();

    await dbInstance
      .insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        username: data.username,
        password_digest: data.passwordDigest,
        role: data.role,
      })
      .into("users")
      .returning("*");

    const dbUserCountsAfter = await getAllUsersCount();

    expect(parseInt(dbUserCountsBefore.rows[0]["count"]) + 1).toEqual(
      parseInt(dbUserCountsAfter.rows[0]["count"]),
    );
  });

  it("should return null if user not found", async () => {
    const nullRecord = await userService.getUserById(1);

    expect(nullRecord).toBeNull();
  });

  async function getAllUsersCount() {
    return await dbInstance.raw("SELECT COUNT (*) FROM users");
  }
});
