import axios from 'axios';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  try {
    const response = await axios.post(`${CMS_URL}/api/rfq-submissions`, req.body, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('RFQ submission error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      message: 'Failed to submit RFQ',
      error: error.response?.data || error.message,
    });
  }
}
