const { checkTicket } = require("../utils/sheets");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const { ticketId } = req.body;
    if (!ticketId) return res.status(400).json({ status: "error", message: "Missing ticketId" });

    const result = await checkTicket(ticketId);

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "Validation failed" });
  }
};
