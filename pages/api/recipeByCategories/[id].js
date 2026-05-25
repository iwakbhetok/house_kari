import axios from 'axios';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const response = await axios.get(`${CMS_URL}/api/recipes`, {
      params: {
        'where[category][equals]': id,
        'where[status][equals]': 'published',
        depth: 1,
        locale: 'all',
        limit: 100,
        sort: '-publishedAt',
      },
    });
    const docs = response.data?.docs || [];
    res.status(200).json({
      data: docs.map((item) => {
        const title = item.title || {};
        const desc = item.description || {};
        return {
          id: item.id,
          title:    typeof title === 'object' ? (title.id || title.en || '') : title,
          title_en: typeof title === 'object' ? (title.en || title.id || '') : title,
          title_chi: typeof title === 'object' ? (title.en || title.id || '') : title,
          description:    typeof desc === 'object' ? (desc.id || desc.en || '') : desc,
          description_en: typeof desc === 'object' ? (desc.en || desc.id || '') : desc,
          image_png: item.featuredImage?.url || null,
          slug: item.slug || null,
        };
      }),
    });
  } catch (error) {
    console.error('Error fetching recipes by category:', error.message);
    res.status(500).json({ message: 'Failed to fetch data', error: error.message });
  }
}
