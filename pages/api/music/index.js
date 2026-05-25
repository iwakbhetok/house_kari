import axios from 'axios';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

export default async function handler(req, res) {
  try {
    const response = await axios.get(`${CMS_URL}/api/globals/backsound`, {
      params: { depth: 1 },
    });
    const data = response.data;
    res.status(200).json({
      data: {
        link: data.audio?.url || null,
        autoplay: data.autoplay || false,
        loop: data.loop ?? true,
      },
    });
  } catch (error) {
    console.error('Error fetching music:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
