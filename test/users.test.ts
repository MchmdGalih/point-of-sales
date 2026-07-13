import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import supertest from "supertest";
import { app } from "../src/index";
import { logger } from "../src/config/logger";
import { UserTest } from "./helpers/user-helper";

describe("POST/api/v1/user/create", () => {
  let accessToken: string;
  let tokenCashier: string;
  beforeAll(async () => {
    await UserTest.deleteAdminTest();
    await UserTest.deleteCashierTest();
    await UserTest.createAdmin();
    await UserTest.createCashier();

    accessToken = await UserTest.loginAdmin();
    tokenCashier = await UserTest.loginCashier();
  });

  afterAll(async () => {
    await UserTest.deleteAdminTest();
    await UserTest.deleteCashierTest();
    await UserTest.delete();
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
  });

  it("should reject create new user if not admin", async () => {
    const response = await supertest(app)
      .post("/api/v1/user/create")
      .set("Authorization", `Bearer ${tokenCashier}`)
      .send({
        username: "test",
        email: "test@mail.com",
        password: "test123",
      });

    logger.debug(response.body);
    expect(response.status).toBe(403);
  });

  it("should create new user if request is valid", async () => {
    const response = await supertest(app)
      .post("/api/v1/user/create")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        username: "test",
        email: "test@mail.com",
        password: "test123",
      });

    logger.debug(response.body);
    expect(response.status).toBe(201);
    expect(response.body.status).toBe(true);
    expect(response.body.data.username).toBe("test");
    expect(response.body.data.email).toBe("test@mail.com");
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
  });
});

describe("GET /api/v1/user/", () => {
  it("should return list of users", async () => {
    const response = await supertest(app).get("/api/v1/user/");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should return meta pagination", async () => {
    const response = await supertest(app).get("/api/v1/user/");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.meta).toBeDefined();
    expect(response.body.meta.page).toBeDefined();
    expect(response.body.meta.limit).toBeDefined();
    expect(response.body.meta.totalPage).toBeDefined();
    expect(response.body.meta.totalData).toBeDefined();
  });

  it("should not expose password field", async () => {
    const response = await supertest(app).get("/api/v1/user/");

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.data[0].password).toBeUndefined();
  });
});

describe("GET /api/v1/user/:id", () => {
  let userId: string;

  beforeAll(async () => {
    await UserTest.delete();
    await UserTest.createAdmin();
    userId = await UserTest.userGetById();
  });

  afterAll(async () => {
    await UserTest.delete();
  });

  it("should reject if user not found", async () => {
    const response = await supertest(app).get("/api/v1/user/invalid-id");

    expect(response.status).toBe(404);
    expect(response.body.status).toBe(false);
    expect(response.body.message).toBe("User not found");
  });

  it("should return user by id", async () => {
    const response = await supertest(app).get(`/api/v1/user/${userId}`);

    logger.debug(response.body);
    expect(response.status).toBe(200);
    expect(response.body.status).toBe(true);
    expect(response.body.data.id).toBe(userId);
    expect(response.body.data.password).toBeUndefined();
  });
});
