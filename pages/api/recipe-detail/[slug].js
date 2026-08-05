import axios from 'axios';
import { lexicalToHtml } from '@/lib/lexicalToHtml';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

export default async function handler(req, res) {
  const { slug } = req.query;

  try {
    const response = await axios.get(`${CMS_URL}/api/recipes`, {
      params: { 'where[slug][equals]': slug, depth: 2, locale: 'all', limit: 1 },
    });
    const docs = response.data?.docs;
    const item = docs?.[0];
    if (!item || !item.id) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const loc = (field, lang) => {
      if (!field) return '';
      if (typeof field === 'string') return field;
      return field[lang] || field.id || field.en || '';
    };

    res.status(200).json({
      data: {
        id:          item.id,
        title:       loc(item.title, 'id'),
        title_en:    loc(item.title, 'en'),
        title_chi:   loc(item.title, 'en'),
        description:     loc(item.description, 'id'),
        description_en:  loc(item.description, 'en'),
        description_chi: loc(item.description, 'en'),
        ingredients:     lexicalToHtml(item.ingredients?.id ?? item.ingredients),
        ingredients_en:  lexicalToHtml(item.ingredients?.en ?? item.ingredients),
        ingredients_chi: lexicalToHtml(item.ingredients?.en ?? item.ingredients),
        howToMake:     lexicalToHtml(item.instructions?.id ?? item.instructions),
        howToMake_en:  lexicalToHtml(item.instructions?.en ?? item.instructions),
        howToMake_chi: lexicalToHtml(item.instructions?.en ?? item.instructions),
        image:         item.featuredImage?.url || null,
        link_youtube:  item.youtubeLink || null,
        // cookbook is richText in Payload, not a downloadable file
        coockbook:     null,
        coockbook_en:  null,
        coockbook_chi: null,
        slug: item.slug || null,
      },
    });
  } catch (error) {
    console.error('Error fetching recipe detail:', error.message);
    res.status(500).json({ message: 'Failed to fetch data', error: error.message });
  }
}
