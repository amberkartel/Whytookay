// api/validateQR.js
import { getAllRows, updateCell } from "../utils/sheets.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { ticketId } = req.body;
    if (!ticketId) {
      return res.status(400).json({ error: "ticketId required" });
    }

    const rows = await getAllRows(); // each row: [email, ticketId, ref, status, timestamp]
    // find row
    let foundIndex = -1;
    let foundRow = null;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][1] === ticketId) {
        foundIndex = i;
        foundRow = rows[i];
        break;
      }
    }

    if (!foundRow) {
      return res.json({ status: "inexistent" });
    }

    // status is in column 4? Actually our log: [email, ticketId, ref, status, timestamp]
    // We used “unused” / “used” in column 4 (index 3)
    const status = foundRow[3].toLowerCase();

    if (status === "used") {
      return res.json({ status: "used", email: foundRow[0] });
    }

    // otherwise it's unused => mark it used
    const sheetRowNumber = foundIndex + 1; // as Sheets rows are 1-based and header row is row 1
    // We want to update status cell (column D, index 4 in A:E)
    await updateCell(`Sheet1!D${sheetRowNumber}`, [["used"]]);

    return res.json({ status: "valid", email: foundRow[0] });
  } catch (err) {
    console.error("validateQR error:", err);
    return res.status(500).json({ error: "internal error" });
  }
}
