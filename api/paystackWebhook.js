import crypto from "crypto";

// ✅ Verify Paystack payment and trigger email
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    const signature = req.headers["x-paystack-signature"];

    // 🔒 Security check
    if (hash !== signature) {
      console.error("Invalid Paystack signature");
      return res.status(400).json({ error: "Invalid signature" });
    }

    const event = req.body;

    // ✅ Handle successful payment
    if (event.event === "charge.success") {
      const customer = event.data.customer;
      const email = customer.email;
      const name = customer.first_name || "Guest";

      console.log(`✅ Payment success for ${email}`);

      // Call the sendTicket API to send the confirmation email
      try {
        const response = await fetch(`${process.env.BASE_URL}/api/sendTicket`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name }),
        });

        if (!response.ok) {
          const err = await response.text();
          console.error("❌ Failed to send email:", err);
        } else {
          console.log("🎉 Confirmation email sent successfully!");
        }
      } catch (err) {
        console.error("Error triggering sendTicket API:", err);
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
