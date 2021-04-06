import { Pool, PoolConfig } from "pg";
import sinon from "sinon";

describe("pool connection", () => {
  it("throws error on wrong database config", async () => {
    const wrongConfig: PoolConfig = {
      database: "wrong",
      user: "wrongUser",
      password: process.env.DB_PASSWORD,
      max: 10,
      idleTimeoutMillis: 1000,
    };

    const pool = new Pool(wrongConfig);
    const fakeError = {
      message: "database config is invalid",
    };
    const stub = sinon.stub(pool, "connect").resolves(fakeError);

    expect(await pool.connect()).toBe(fakeError);
  });
});
