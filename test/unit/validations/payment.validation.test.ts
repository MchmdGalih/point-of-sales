import { describe, it, expect } from "@jest/globals";
import { paymentSchema } from "../../../src/validations/payment.validation";

describe("Payment body validation ", () => {
  it("should pass when payload is valid", () => {
    const result = paymentSchema.safeParse({
      method: "cash",
    });
    expect(result.success).toBe(true);
  });

  it("should fail when payload is invalid", () => {
    const result = paymentSchema.safeParse({
      method: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("Payment params validation ", () => {
  it("should pass when payload is valid", () => {
    const result = paymentSchema.safeParse({
      orderId: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  it("should fail when payload is invalid", () => {
    const result = paymentSchema.safeParse({
      orderId: "uuid-invalid",
    });
    expect(result.success).toBe(false);
  });
});
