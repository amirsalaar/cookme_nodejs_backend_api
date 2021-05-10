import { Knex } from "knex";
import { setupTestDatabase, resetTestDatabase } from "../../../db/dbHelpers";
import { UserRepository } from "../../../models";

describe("UserRepository.getUserbyId", () => {
  let dbInstance: Knex<any, unknown[]>;
  let userRepo: UserRepository;
  beforeEach(async () => {
    dbInstance = await setupTestDatabase();
    userRepo = new UserRepository();
  });

  afterEach(async () => {
    await resetTestDatabase();
  });

  afterAll(async () => await dbInstance.destroy());

  it("should return a user", async () => {
    const data = {
      firstName: "Joe",
      lastName: "Biden",
      email: "joe@biden.com",
      role: 1,
    };

    await dbInstance
      .insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        role: data.role,
      })
      .into("users")
      .returning("*");

    const actual = await dbInstance.raw(
      'select * from "users" u where u.id = 1',
    );

    const expected = await userRepo.getUserById(1);
    expect(actual.rows[0]).toStrictEqual(expected);
  });
});
