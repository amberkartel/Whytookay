import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, name } = req.body;

    // Load the HTML template
    const emailPath = path.join(process.cwd(), "email-template.html");
    let htmlContent = fs.readFileSync(emailPath, "utf8");

    // Optional personalization (replace placeholder if added in HTML)
    htmlContent = htmlContent.replace("{{name}}", name || "Guest");

    // Setup transporter (use Gmail or your own SMTP)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // app password (not normal password)
      },
    });

    // Mail options
    const mailOptions = {
      from: `"Y2kfest Sagamu" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Y2kfest Sagamu – Ticket Confirmation",
      html: htmlContent,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log(`Ticket email sent to ${email}`);
    return res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
