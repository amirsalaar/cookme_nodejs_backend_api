import { db } from "../../../db";

describe("db", () => {
  it("should connect to db", async () => {
    const dbInstance = await db.db();
    const res = await dbInstance.raw("select 1");
    dbInstance.destroy();
    expect(res).toBeDefined();
  });
});
