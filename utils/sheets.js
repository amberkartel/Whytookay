// utils/sheets.js
import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function getAuthClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });
}

export async function appendRow(values) {
  const auth = getAuthClient();
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });
  const res = await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: "Sheet1!A:E",
    valueInputOption: "RAW",
    resource: { values: [values] },
  });
  return res.data;
}

export async function getAllRows() {
  const auth = getAuthClient();
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: "Sheet1!A:E",
  });
  return res.data.values || [];
}

export async function updateCell(range, values) {
  const auth = getAuthClient();
  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });
  const res = await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SHEET_ID,
    range,
    valueInputOption: "RAW",
    resource: { values },
  });
  return res.data;
}
