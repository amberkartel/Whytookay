const axios = require("axios");
const sendTicket = require("./sendTicket");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const secret = process.env.PAYSTACK_SECRET;
    const { reference } = req.body;

    // Verify payment with Paystack
    const verify = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${secret}` } }
    );

    if (verify.data.status && verify.data.data.status === "success") {
      await sendTicket(verify.data.data.customer.email, reference);
      return res.status(200).send("Ticket sent successfully");
    } else {
      return res.status(400).send("Payment not verified");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Webhook error");
  }
};
