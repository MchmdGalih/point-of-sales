import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import supertest from "supertest";
import { app } from "../../src/index";
import { logger } from "../../src/config/logger";
import { UserHelper } from "../helpers/user-helper";

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
    await UserHelper.delete();
    await UserHelper.create();
    userId = await UserHelper.userGetById();
  });

  afterAll(async () => {
    await UserHelper.delete();
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
