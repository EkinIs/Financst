import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendContactEmail = async (req, res) => {
  // Form data from frontend
  const { name, surname, email, message } = req.body;

  if (!name || !surname || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // 1. Transporter Setup (Your SMTP credentials)
    // This account is the SENDER account.
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_USER, // support@financst.com (SMTP username)
        pass: process.env.EMAIL_PASS, // App Password
      },
    });

    // 2. Mail Options
    const mailOptions = {
      // IMPORTANT: 'from' must be your own authorized email. 
      // If you put the user's email here, Gmail/Cloudflare will block it.
      from: process.env.EMAIL_USER, 
      
      // Recipient: Again your support address (or another admin email)
      to: 'support@financst.com', 
      
      // CRITICAL POINT: 'Reply-To'
      // When you read the email and click "Reply", the response goes to this address.
      replyTo: email, 

      subject: `New Contact: ${name} ${surname}`,
      
      text: `
        You have received a new message from the contact form.

        Sender Info:
        Name: ${name} ${surname}
        Email: ${email}
        -----------------------
        Message:
        ${message}
      `,
      html: `
        <h3>New Contact Message</h3>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px;">
            <p><strong>From:</strong> ${name} ${surname}</p>
            <p><strong>User Email:</strong> <a href="mailto:${email}">${email}</a></p>
        </div>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
        <hr />
        <p style="font-size: 12px; color: gray;">Click "Reply" to respond directly to the user.</p>
      `,
    };

    // 3. Send Mail
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email. Please try again later." });
  }
};