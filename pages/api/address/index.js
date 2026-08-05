import axios from 'axios';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

export default async function handler(req, res) {
  try {
    const response = await axios.get(`${CMS_URL}/api/globals/site-settings`, {
      params: { depth: 0, locale: 'id' },
    });
    const data = response.data;
    res.status(200).json({
      data: {
        address: data.address || null,
      },
    });
  } catch (error) {
    console.error('Error fetching address:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
