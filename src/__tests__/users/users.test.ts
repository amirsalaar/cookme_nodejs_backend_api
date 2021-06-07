import supertest from "supertest";
import shortid from "shortid";
import mongoose from "mongoose";
import { appRunner } from "../../app";

let firstUserIdTest = "";

const firstUserBody = {
  email: `amir.salar+${shortid.generate()}@amirsalar.ca`,
  password: "Sup3rSecret!23",
};
let accessToken = "";
let refreshToken = "";
const newFirstName = "Jose";
const newFirstName2 = "Paulo";
const newLastName2 = "Faraco";

describe("users and auth endpoints", () => {
  let request: supertest.SuperAgentTest;

  beforeAll(() => {
    request = supertest.agent(appRunner());
  });

  /**
   * Shutdown express and close MongoDB connection after all tests
   */
  afterAll(() =>
    appRunner().close(async () => await mongoose.connection.close()),
  );

  it("should allow a POST to /api/v2/users", async () => {
    const res = await request.post("/api/v2/users").send(firstUserBody);
    console.log(res.body);

    expect(res.status).toEqual(201);
    expect(res.body).not.toBeNull();
    expect(typeof res.body).toBe("object");
    expect(typeof res.body.id).toBe("string");
    firstUserIdTest = res.body.id;
  });

  it("should allow a POST to /api/v2/auth", async () => {
    const res = await request.post("/api/v2/auth").send(firstUserBody);
    expect(res.status).toEqual(201);
    expect(res.body).not.toBeNull();
    expect(typeof res.body).toBe("object");
    expect(typeof res.body.accessToken).toBe("string");

    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it("should allow a GET from /api/v2/users/:userId with an access token", async () => {
    const res = await request
      .get(`/api/v2/users/${firstUserIdTest}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send();
    expect(res.status).toEqual(200);
    expect(res.body).not.toBeNull();
    expect(typeof res.body).toBe("object");
    expect(typeof res.body._id).toBe("string");
    expect(res.body._id).toEqual(firstUserIdTest);
    expect(res.body.email).toEqual(firstUserBody.email);
  });
});
