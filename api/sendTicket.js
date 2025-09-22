const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
const Jimp = require("jimp");
const { logTicket, getNextTicketId } = require("../utils/sheets");

module.exports = async function sendTicket(email, reference) {
  try {
    // Generate ticket ID
    const ticketId = await getNextTicketId();

    // Generate QR code
    const qrData = { ticketId, reference };
    const qrBuffer = await QRCode.toBuffer(JSON.stringify(qrData));

    // Load QR + Logo
    const qrImage = await Jimp.read(qrBuffer);
    const logo = await Jimp.read(process.env.LOGO_PATH || "public/logo.png");
    logo.resize(qrImage.bitmap.width / 4, Jimp.AUTO);

    const x = qrImage.bitmap.width / 2 - logo.bitmap.width / 2;
    const y = qrImage.bitmap.height / 2 - logo.bitmap.height / 2;
    qrImage.composite(logo, x, y);

    const finalQR = await qrImage.getBufferAsync(Jimp.MIME_PNG);

    // Email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Y2K Fest" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎟️ Your Y2K Fest Ticket",
      text: `Here is your ticket ID: ${ticketId}. Show the QR code at entry.`,
      attachments: [
        {
          filename: `${ticketId}.png`,
          content: finalQR
        }
      ]
    });

    // Log to Google Sheets
    await logTicket(email, ticketId, reference);

    console.log(`Ticket sent to ${email}`);
  } catch (err) {
    console.error("Send ticket error:", err);
    throw err;
  }
};
