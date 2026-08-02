import axios from 'axios';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { name, phone_number, email, inquiries } = req.body;

    const response = await axios.post(`${CMS_URL}/api/contacts`, {
      name,
      email,
      phoneNumber: phone_number,
      inquiries,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error posting form data:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to submit form' });
  }
}
