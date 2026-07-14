import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import supertest from "supertest";
import { app } from "../../../src/index";
import { logger } from "../../../src/config/logger";
import { UserHelper } from "../../helpers/user-helper";

describe("POST/api/v1/user/create", () => {
  let accessToken: string;
  let cashierToken: string;
  let userId: string;

  beforeAll(async () => {
    await UserHelper.create();
    const { token, tokenCashier } = await UserHelper.setupAdminAndCashier();

    accessToken = token;
    cashierToken = tokenCashier;
    userId = await UserHelper.userGetById();
  });

  afterAll(async () => {
    await UserHelper.deleteAdminTest();
    await UserHelper.deleteCashierTest();
    await UserHelper.delete();
  });

  it("should reject create new user if request in valid", async () => {
    const response = await supertest(app).post("/api/v1/user/create").send({
      username: "",
      email: "",
      password: "",
    });

    logger.debug(response.body);
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it("should reject create new user if no accessToken", async () => {
    const response = await supertest(app).post("/api/v1/user/create").send({
      username: "test",
      email: "test@mail.com",
      password: "test123",
    });

    logger.debug(response.body);
    expect(response.status).toBe(401);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toContain("Unauthorized");
  });

  it("should reject create new user if not admin", async () => {
    const response = await supertest(app)
      .post("/api/v1/user/create")
      .set("Authorization", `Bearer ${cashierToken}`)
      .send({
        username: "test",
        email: "test@mail.com",
        password: "test123",
      });

    logger.debug(response.body);
    expect(response.status).toBe(403);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toContain(
      "Forbidden, you are not authorized to access this!",
    );
  });

  it("should create new user if request is valid", async () => {
    const response = await supertest(app)
      .post("/api/v1/user/create")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        username: "test1",
        email: "test1@mail.com",
        password: "test123",
      });

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.status).toBe(true);
    expect(response.body.data.username).toBe("test1");
    expect(response.body.data.email).toBe("test1@mail.com");
  });

  it("should reject create new user if email already exist", async () => {
    const response = await supertest(app)
      .post("/api/v1/user/create")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        username: "test",
        email: "test@mail.com",
        password: "test123",
      });

    logger.debug(response.body);
    expect(response.status).toBe(409);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toContain("User already exist");
  });
});
