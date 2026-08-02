import axios from 'axios';
import { CMS_URL, CAREER_LIST_PARAMS, normalizeCareer } from '@/lib/cmsCareer';

export default async function handler(req, res) {
  try {
    const response = await axios.get(`${CMS_URL}/api/careers`, { params: CAREER_LIST_PARAMS });
    const docs = response.data?.docs || [];
    res.status(200).json({ data: docs.map((doc) => normalizeCareer(doc)) });
  } catch (error) {
    console.error('Error fetching careers:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}
