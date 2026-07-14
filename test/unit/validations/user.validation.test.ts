import { describe, it, expect } from "@jest/globals";

import { createUserSchema } from "../../../src/validations/users.validtion";

describe("Create user validation", () => {
  it("should pass when payload is valid", () => {
    const result = createUserSchema.safeParse({
      username: "test",
      email: "test@mail.com",
      password: "test123",
    });
    expect(result.success).toBe(true);
  });

  it("should fail when payload is invalid", () => {
    const result = createUserSchema.safeParse({
      username: "",
      email: "",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when payload is invalid because username is too short", () => {
    const result = createUserSchema.safeParse({
      username: "te",
      email: "test@mail.com",
      password: "test123",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when payload is invalid because email is invalid", () => {
    const result = createUserSchema.safeParse({
      username: "test",
      email: "test-mail.com",
      password: "test123",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when payload is invalid because password is empty", () => {
    const result = createUserSchema.safeParse({
      username: "test",
      email: "test@mail.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
