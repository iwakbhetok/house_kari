import axios from 'axios';
import { CMS_URL, normalizeCareerCategory } from '@/lib/cmsCareer';

export default async function handler(req, res) {
  try {
    const response = await axios.get(`${CMS_URL}/api/career-categories`, {
      params: { locale: 'all', depth: 0, limit: 100 },
    });
    const docs = response.data?.docs || [];
    res.status(200).json({ data: docs.map((doc) => normalizeCareerCategory(doc)) });
  } catch (error) {
    console.error('Error fetching career categories:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
