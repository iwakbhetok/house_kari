import axios from 'axios';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

function lexicalToText(node) {
  if (!node) return '';
  if (node.type === 'text') return node.text || '';
  if (node.children) return node.children.map(lexicalToText).join('');
  return '';
}

export default async function handler(req, res) {
  try {
    const response = await axios.get(`${CMS_URL}/api/reviews`, {
      params: {
        'where[isApproved][equals]': true,
        depth: 1,
        sort: '-createdAt',
        limit: 100,
      },
    });
    const docs = response.data?.docs || [];
    res.status(200).json({
      data: docs.map((item) => {
        const descRaw = item.description;
        const description =
          descRaw && typeof descRaw === 'object'
            ? lexicalToText(descRaw.root ?? descRaw)
            : descRaw || '';
        return {
          id: item.id,
          name: item.name || '',
          images: item.images?.[0]?.image?.url || null,
          description,
          date: item.date || item.createdAt || null,
        };
      }),
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
