import axios from 'axios';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

export default async function handler(req, res) {
  try {
    const response = await axios.get(`${CMS_URL}/api/globals/theme-images`, {
      params: { depth: 1 },
    });
    const data = response.data;
    res.status(200).json({
      data: {
        header: data.header?.url || null,
        footer: data.footer?.url || null,
      },
    });
  } catch (error) {
    console.error('Error fetching theme images:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
