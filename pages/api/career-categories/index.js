// File: pages/api/career-categories.js

import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get(process.env.API_URL + '/apiv2/career-categories', {
      headers: {
        'api_key': process.env.API_KEY // Ganti dengan API key Anda
      }
    });
    const careersCategories = response.data;
    res.status(200).json(careersCategories);
  } catch (error) {
    console.error('Error fetching careersCategories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
