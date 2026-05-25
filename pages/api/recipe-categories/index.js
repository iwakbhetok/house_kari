import axios from 'axios';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

export default async function handler(req, res) {
  try {
    const response = await axios.get(`${CMS_URL}/api/recipe-categories`, {
      params: { depth: 0, locale: 'all', limit: 100 },
    });
    const docs = response.data?.docs || [];
    res.status(200).json({
      data: docs.map((item) => {
        const name = item.name || {};
        return {
          id: item.id,
          name: (typeof name === 'object' ? name.id || name.en : name) || '',
          name_en: (typeof name === 'object' ? name.en || name.id : name) || '',
          name_chi: (typeof name === 'object' ? name.en || name.id : name) || '',
        };
      }),
    });
  } catch (error) {
    console.error('Error fetching recipe categories:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
