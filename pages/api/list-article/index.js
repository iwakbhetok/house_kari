import axios from 'axios';
import { CMS_URL, LIST_PARAMS, normalizeArticle } from '@/lib/cmsArticle';

export default async function handler(req, res) {
  try {
    const response = await axios.get(`${CMS_URL}/api/articles`, { params: LIST_PARAMS });
    const docs = response.data?.docs || [];
    res.status(200).json({ data: docs.map((doc) => normalizeArticle(doc)) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
}
