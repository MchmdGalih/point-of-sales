import { describe, it, expect } from "@jest/globals";
import { loginSchema } from "../../../src/validations/auth.validation";

describe("Login validation", () => {
  it("should pass when payload is valid", () => {
    const result = loginSchema.safeParse({
      email: "test@mail.com",
      password: "test123",
    });
    expect(result.success).toBe(true);
  });

  it("should fail when payload is invalid", () => {
    const result = loginSchema.safeParse({
      email: "",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when payload is invalid because email is invalid", () => {
    const result = loginSchema.safeParse({
      email: "test",
      password: "test123",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when payload is invalid because password is invalid", () => {
    const result = loginSchema.safeParse({
      email: "test@mail",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
