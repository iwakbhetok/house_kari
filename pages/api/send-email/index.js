const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, number, email, inquiries } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'mraflyyy26@gmail.com',
        pass: 'mhmdrfli09',
      },
    });

    const mailOptions = {
      from: email,
      to: 'mraflyyy26@gmail.com',
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
