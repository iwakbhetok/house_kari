const nodemailer = require('nodemailer');

// Disabled by default. To re-enable, set SEND_EMAIL_ENABLED=true along with
// SEND_EMAIL_USER and SEND_EMAIL_PASS (Gmail app password) in the environment.
const ENABLED = process.env.SEND_EMAIL_ENABLED === 'true';
const EMAIL_USER = process.env.SEND_EMAIL_USER;
const EMAIL_PASS = process.env.SEND_EMAIL_PASS;

export default async function handler(req, res) {
  if (!ENABLED || !EMAIL_USER || !EMAIL_PASS) {
    return res.status(404).json({ message: 'Not found' });
  }

  if (req.method === 'POST') {
    const { name, number, email, inquiries } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      replyTo: email,
      to: EMAIL_USER,
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nNumber: ${number}\nEmail: ${email}\nInquiries: ${inquiries}`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
