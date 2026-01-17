// File: pages/api/banner.js

import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get(process.env.API_URL + '/apiv2/address', {
      headers: {
        'api_key': process.env.API_KEY // Ganti dengan API key Anda
      }
    });
    const address = response.data;
    res.status(200).json(address);
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
