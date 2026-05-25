import axios from 'axios';
import { CMS_URL, LIST_PARAMS, normalizeArticle, resolveCategoryId } from '@/lib/cmsArticle';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const categoryId = await resolveCategoryId(id);
    if (!categoryId) return res.status(200).json({ data: [] });

    const response = await axios.get(`${CMS_URL}/api/articles`, {
      params: { ...LIST_PARAMS, 'where[category][equals]': categoryId },
    });
    const docs = response.data?.docs || [];
    res.status(200).json({ data: docs.map((doc) => normalizeArticle(doc)) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch data', error: error.message });
  }
}
