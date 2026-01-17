// File: pages/api/banner.js

import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get(process.env.API_URL + '/apiv2/socialmedia', {
      headers: {
        'api_key': process.env.API_KEY // Ganti dengan API key Anda
      }
    });
    const socialmedia = response.data;
    res.status(200).json(socialmedia);
  } catch (error) {
    console.error('Error fetching socialmedia:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
