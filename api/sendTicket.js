// api/sendTicket.js
import QRCode from "qrcode";
import Jimp from "jimp";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";
import { appendRow, getAllRows } from "../utils/sheets.js";

const LOGO_DEFAULT_PATH = path.join(process.cwd(), "public", "logo.png");

function formatTicketId(number) {
  return `Y2K-${String(number).padStart(5, "0")}`; // Y2K-00001 style
}

async function overlayLogoOnQR(qrBuffer) {
  try {
    const qrImage = await Jimp.read(qrBuffer);
    const logoPath = process.env.LOGO_PATH || LOGO_DEFAULT_PATH;
    if (!fs.existsSync(logoPath)) {
      return await qrImage.getBase64Async(Jimp.MIME_PNG);
    }
    const logo = await Jimp.read(logoPath);
    const logoSize = Math.floor(qrImage.bitmap.width * 0.2);
    logo.resize(logoSize, logoSize);
    const x = qrImage.bitmap.width / 2 - logo.bitmap.width / 2;
    const y = qrImage.bitmap.height / 2 - logo.bitmap.height / 2;
    qrImage.composite(logo, x, y);
    return await qrImage.getBase64Async(Jimp.MIME_PNG);
  } catch (err) {
    console.error("QR overlay error:", err);
    return null;
  }
}

async function generateTicketAndQR(email, paystackRef) {
  const rows = await getAllRows();
  let lastNumber = 0;
  for (let i = rows.length - 1; i >= 0; i--) {
    const ticketId = rows[i][1];
    if (ticketId && ticketId.startsWith("Y2K-")) {
      const parts = ticketId.split("-");
      const num = parseInt(parts[1], 10);
      if (!isNaN(num)) {
        lastNumber = Math.max(lastNumber, num);
        break;
      }
    }
  }
  const nextNum = lastNumber + 1;
  const ticketId = formatTicketId(nextNum);

  const payload = JSON.stringify({ ticketId, email, ref: paystackRef });
  const qrBuffer = await QRCode.toBuffer(payload, { width: 600, margin: 2 });

  const finalQRDataUrl = await overlayLogoOnQR(qrBuffer);
  return { ticketId, qrDataUrl: finalQRDataUrl };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, ref } = req.body;
    if (!email || !ref) {
      return res.status(400).json({ error: "email and ref required" });
    }

    const { ticketId, qrDataUrl } = await generateTicketAndQR(email, ref);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailHtml = `
      <div style="font-family: Arial, sans-serif; color:#111;">
        <h2>🎟 Y2K Fest Ticket</h2>
        <p>Hi — thanks for buying your ticket. Your Ticket ID is <strong>${ticketId}</strong></p>
        <p>Show the QR code below at the gate:</p>
        <img src="${qrDataUrl}" alt="QR Ticket" style="max-width: 300px;" />
        <p style="font-size:0.9rem; color:#444">Event: 18th December — Rita Park, Sagamu</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Y2K Fest" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Y2K Fest Ticket — ${ticketId}`,
      html: mailHtml,
    });

    const timestamp = new Date().toISOString();
    await appendRow([email, ticketId, ref, "unused", timestamp]);

    return res.json({ success: true, ticketId });
  } catch (err) {
    console.error("sendTicket error:", err);
    return res.status(500).json({ error: "internal error" });
  }
}
