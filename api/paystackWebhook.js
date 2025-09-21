// api/paystackWebhook.js
import fetch from "node-fetch";
import sendTicketHandler from "./sendTicket.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const body = req.body;
    const event = body.event || body.type || null;
    const data = body.data || body;
    const reference = data?.reference || data?.id || null;

    if (!reference) {
      console.warn("No reference in webhook:", body);
      return res.status(400).json({ ok: false, error: "no reference" });
    }

    const verifyResp = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
    });
    const verifyJson = await verifyResp.json();

    if (!verifyJson.status || verifyJson.status !== true) {
      console.warn("Paystack verify failed:", verifyJson);
      return res.status(400).json({ ok: false, error: "verification failed" });
    }

    const trans = verifyJson.data;
    if (trans.status !== "success") {
      return res.status(200).json({ ok: false, message: "payment not successful" });
    }

    const expected = 10000 * 100; 
    if (trans.amount < expected) {
      console.warn("Amount mismatch", trans.amount, "expected", expected);
      return res.status(400).json({ ok: false, error: "amount mismatch" });
    }

    const email = trans.customer?.email || trans.customer?.email_address || (trans.authorization && trans.authorization.customer_email);

    if (!email) {
      console.warn("No email in transaction data", trans);
      return res.status(400).json({ ok: false, error: "no email in transaction" });
    }

    // Call sendTicket.js internally
    try {
      const fakeReq = { method: "POST", body: { email, ref: reference } };
      const fakeRes = {
        statusCode: 200,
        data: null,
        status(code) { this.statusCode = code; return this; },
        json(d) { this.data = d; return d; },
        end() { return; }
      };
      const module = await import("./sendTicket.js");
      await module.default(fakeReq, fakeRes);
    } catch (err) {
      console.error("Error calling sendTicket internally:", err);
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Webhook handling error:", err);
    return res.status(500).json({ ok: false, error: "internal server error" });
  }
}
