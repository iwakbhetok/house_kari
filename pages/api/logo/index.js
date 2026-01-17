// File: pages/api/banner.js

import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://prahwa.net/apiv2/logo', {
      headers: {
        'api_key': 'mhHoCDQEPiYD7vU37K5AX0bKuP86a31wU2P8N86L' // Ganti dengan API key Anda
      }
    });
    const logo = response.data;
    res.status(200).json(logo);
  } catch (error) {
    console.error('Error fetching logo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
