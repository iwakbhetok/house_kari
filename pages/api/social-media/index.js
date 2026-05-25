import axios from 'axios';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

export default async function handler(req, res) {
  try {
    const response = await axios.get(`${CMS_URL}/api/social-media`, {
      params: { depth: 1, sort: 'sortOrder', limit: 100 },
    });
    const docs = response.data?.docs || [];
    res.status(200).json({
      data: docs.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.icon?.url || null,
        link: item.link,
      })),
    });
  } catch (error) {
    console.error('Error fetching social media:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
