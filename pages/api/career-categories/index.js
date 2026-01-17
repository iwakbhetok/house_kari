// File: pages/api/career-categories.js

import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://prahwa.net/apiv2/career-categories', {
      headers: {
        'api_key': 'mhHoCDQEPiYD7vU37K5AX0bKuP86a31wU2P8N86L' // Ganti dengan API key Anda
      }
    });
    const careersCategories = response.data;
    res.status(200).json(careersCategories);
  } catch (error) {
    console.error('Error fetching careersCategories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
