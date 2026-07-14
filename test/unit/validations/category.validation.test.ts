import { describe, it, expect } from "@jest/globals";
import { categorySchema } from "../../../src/validations/category.validation";

describe("Create category validation", () => {
  it("should pass when payload is valid", () => {
    const result = categorySchema.safeParse({
      name: "test",
    });
    expect(result.success).toBe(true);
  });

  it("should fail when payload is invalid", () => {
    const result = categorySchema.safeParse({
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when payload is invalid because name is too short", () => {
    const result = categorySchema.safeParse({
      name: "te",
    });
    expect(result.success).toBe(false);
  });
});
