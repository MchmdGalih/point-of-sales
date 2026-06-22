import "dotenv/config";
import midtransClient from "midtrans-client";

const serverKey = process.env.MIDTRANS_SERVER_KEY;
const clientKey = process.env.MIDTRANS_CLIENT_KEY;

if (!serverKey || !clientKey) throw new Error("Midtrans key not found");

export const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey,
  clientKey,
});
