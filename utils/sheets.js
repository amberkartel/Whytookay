const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

const sheets = google.sheets({ version: "v4", auth });

const SHEET_ID = process.env.SHEET_ID;
const RANGE = "Tickets!A:D"; // [Email, TicketId, Reference, Status]

async function getNextTicketId() {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE
  });

  const rows = res.data.values || [];
  const nextNumber = rows.length + 1;
  return `Y2K-${String(nextNumber).padStart(5, "0")}`;
}

async function logTicket(email, ticketId, reference) {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: RANGE,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[email, ticketId, reference, "unused"]]
    }
  });
}

async function checkTicket(ticketId) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: RANGE
  });

  const rows = res.data.values || [];
  const rowIndex = rows.findIndex(r => r[1] === ticketId);

  if (rowIndex === -1) return { status: "inexistent" };

  const status = rows[rowIndex][3];
  if (status === "used") return { status: "used" };

  // Mark as used
  rows[rowIndex][3] = "used";
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `Tickets!A${rowIndex + 1}:D${rowIndex + 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [rows[rowIndex]] }
  });

  return { status: "valid" };
}

module.exports = { getNextTicketId, logTicket, checkTicket };
