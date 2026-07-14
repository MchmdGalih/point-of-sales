import { describe, it, expect } from "@jest/globals";
import { productSchema } from "../../../src/validations/product.validation";

describe("Create product validation", () => {
  it("should pass when payload is valid", () => {
    const result = productSchema.safeParse({
      name: "test",
      price: 1,
      stock: 1,
      categoryId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  it("shoud product if payload is invalid", () => {
    const result = productSchema.safeParse({
      name: "",
      price: "",
      stock: "",
      categoryId: "",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when payload is invalid because name is too short", () => {
    const result = productSchema.safeParse({
      name: "te",
      price: 1,
      stock: 1,
      categoryId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when payload is invalid because price is not a number", () => {
    const result = productSchema.safeParse({
      name: "test",
      price: "test",
      stock: 1,
      categoryId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when payload is invalid because stock is not a number", () => {
    const result = productSchema.safeParse({
      name: "test",
      price: 1,
      stock: "test",
      categoryId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when payload is invalid because category id is not a uuid", () => {
    const result = productSchema.safeParse({
      name: "test",
      price: 1,
      stock: 1,
      categoryId: "uuid-invalid",
    });
    expect(result.success).toBe(false);
  });

  it("should fail when payload is invalid because stock less than 1 is not a valid uuid", () => {
    const result = productSchema.safeParse({
      name: "test",
      price: 1,
      stock: 0,
      categoryId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(false);
  });
});
