import { Knex } from "knex";
import { setupTestDatabase, resetTestDatabase } from "../../../db/dbHelpers";
import { getUserById } from "../../../models";

describe("getUserbyId", () => {
  let dbInstance: Knex<any, unknown[]>;
  beforeEach(async () => {
    dbInstance = await setupTestDatabase();
  });

  afterEach(async () => {
    await resetTestDatabase();
  });
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

    const expected = await getUserById(1);
    expect(actual.rows[0]).toStrictEqual(expected);
  });
});
