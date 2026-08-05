import axios from 'axios';
import { CMS_URL, CAREER_LIST_PARAMS, normalizeCareer, resolveCareerCategoryId } from '@/lib/cmsCareer';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const categoryId = await resolveCareerCategoryId(id);
    if (!categoryId) {
      return res.status(200).json({ data: [] });
    }

    const response = await axios.get(`${CMS_URL}/api/careers`, {
      params: { ...CAREER_LIST_PARAMS, 'where[category][equals]': categoryId },
    });
    const docs = response.data?.docs || [];
    res.status(200).json({ data: docs.map((doc) => normalizeCareer(doc)) });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch data', error: error.message });
  }
}
