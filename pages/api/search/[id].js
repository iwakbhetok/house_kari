import axios from 'axios';
import { CMS_URL, normalizeArticle } from '@/lib/cmsArticle';

export default async function handler(req, res) {
  const { id: key } = req.query;

  if (!key) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    const [articlesRes, productsRes, recipesRes] = await Promise.all([
      axios.get(`${CMS_URL}/api/articles`, {
        params: {
          'where[status][equals]': 'published',
          'where[or][0][title][contains]': key,
          'where[or][1][excerpt][contains]': key,
          locale: 'all',
          depth: 2,
          limit: 50,
          sort: '-publishedAt',
        },
      }),
      axios.get(`${CMS_URL}/api/products`, {
        params: {
          'where[status][equals]': 'active',
          'where[or][0][name][contains]': key,
          locale: 'all',
          depth: 1,
          limit: 50,
          sort: 'sortOrder',
        },
      }),
      axios.get(`${CMS_URL}/api/recipes`, {
        params: {
          'where[status][equals]': 'published',
          'where[or][0][title][contains]': key,
          'where[or][1][description][contains]': key,
          locale: 'all',
          depth: 1,
          limit: 50,
          sort: '-publishedAt',
        },
      }),
    ]);

    const articles = (articlesRes.data?.docs || []).map((doc) => normalizeArticle(doc));

    const products = (productsRes.data?.docs || []).map((item) => {
      const name = item.name || {};
      return {
        id: item.id,
        name: (typeof name === 'object' ? name.id || name.en : name) || '',
        name_en: (typeof name === 'object' ? name.en || name.id : name) || '',
        name_chi: (typeof name === 'object' ? name.en || name.id : name) || '',
        image: item.image?.url || null,
        weight: item.weight || '',
        slug: item.slug || null,
      };
    });

    const reseps = (recipesRes.data?.docs || []).map((item) => {
      const title = item.title || {};
      const desc = item.description || {};
      return {
        id: item.id,
        title: (typeof title === 'object' ? title.id || title.en : title) || '',
        title_en: (typeof title === 'object' ? title.en || title.id : title) || '',
        title_chi: (typeof title === 'object' ? title.en || title.id : title) || '',
        description: (typeof desc === 'object' ? desc.id || desc.en : desc) || '',
        description_en: (typeof desc === 'object' ? desc.en || desc.id : desc) || '',
        image: item.featuredImage?.url || null,
        date: item.publishedAt || null,
        slug: item.slug || null,
      };
    });

    res.status(200).json({
      message: 'Successfully fetched data',
      data: { articles, products, reseps },
    });
  } catch (error) {
    console.error('Error fetching search results:', error.message);
    res.status(500).json({ message: 'Failed to fetch data', error: error.message });
  }
}
