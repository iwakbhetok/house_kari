import axios from 'axios';
import { lexicalToHtml } from '@/lib/lexicalToHtml';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const response = await axios.get(`${CMS_URL}/api/products/${id}`, {
      params: { depth: 2, locale: 'all' },
    });
    const item = response.data;
    if (!item || !item.id) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const name = item.name || {};
    const desc = item.description || {};

    res.status(200).json({
      data: {
        id: item.id,
        name:     (typeof name === 'object' ? name.id || name.en : name) || '',
        name_en:  (typeof name === 'object' ? name.en || name.id : name) || '',
        name_chi: (typeof name === 'object' ? name.en || name.id : name) || '',
        description:     lexicalToHtml(typeof desc === 'object' ? desc.id ?? desc : desc),
        description_en:  lexicalToHtml(typeof desc === 'object' ? desc.en ?? desc : desc),
        description_chi: lexicalToHtml(typeof desc === 'object' ? desc.en ?? desc : desc),
        image:  item.image?.url || null,
        weight: item.weight || '',
        ecommerce_links: item.ecommerceLinks || [],
        slug: item.slug || null,
      },
    });
  } catch (error) {
    console.error('Error fetching product detail:', error.message);
    res.status(500).json({ message: 'Failed to fetch data', error: error.message });
  }
}
