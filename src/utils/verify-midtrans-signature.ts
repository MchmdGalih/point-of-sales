import crypto from "crypto";

export const verifyMidtransSignature = (params: {
  orderId: string;
  signatureKey: string;
  statusCode: string;
  grossAmount: string;
}) => {
  const { orderId, statusCode, signatureKey, grossAmount } = params;

  const hash = crypto
    .createHash("sha512")
    .update(
      `${orderId}${statusCode}${grossAmount}${process.env.MIDTRANS_SERVER_KEY}`,
    )
    .digest("hex");
  return hash === signatureKey;
};
