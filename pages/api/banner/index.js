import axios from 'axios';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

export default async function handler(req, res) {
  try {
    const response = await axios.get(`${CMS_URL}/api/banners`, {
      params: {
        'where[isActive][equals]': true,
        'where[position][equals]': 'default',
        depth: 1,
        sort: 'sortOrder',
        limit: 100,
      },
    });
    const docs = response.data?.docs || [];
    res.status(200).json({
      data: docs.map((doc) => ({
        id: doc.id,
        image: doc.image?.url || null,
        link: doc.link || null,
        type: doc.title || null,
      })),
    });
  } catch (error) {
    console.error('Error fetching banners:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
