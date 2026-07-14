import { describe, it, expect } from "@jest/globals";
import { orderSchema } from "../../../src/validations/order.validation";

describe("Order validation", () => {
  it("should pass when payload is valid", () => {
    const result = orderSchema.safeParse({
      customerName: "test",
      orderItems: [
        {
          productId: "550e8400-e29b-41d4-a716-446655440000",
          quantity: 1,
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("should fail when payload is invalid because customer name is required", () => {
    const result = orderSchema.safeParse({
      customerName: "",
      orderItems: [
        {
          productId: "550e8400-e29b-41d4-a716-446655440000",
          quantity: 1,
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("should fail when payload is invalid because customer name is too short", () => {
    const result = orderSchema.safeParse({
      customerName: "te",
      orderItems: [
        {
          productId: "550e8400-e29b-41d4-a716-446655440000",
          quantity: 1,
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("should fail when payload is invalid because order items is required", () => {
    const result = orderSchema.safeParse({
      customerName: "test",
      orderItems: [],
    });
    expect(result.success).toBe(false);
  });

  it("should fail when payload is invalid because order items is not an array", () => {
    const result = orderSchema.safeParse({
      customerName: "test",
      orderItems: {
        productId: "550e8400-e29b-41d4-a716-446655440000",
        quantity: 1,
      },
    });
    expect(result.success).toBe(false);
  });
});
