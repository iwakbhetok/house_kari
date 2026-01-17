// File: pages/api/all-careers.js

import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get(process.env.API_URL + '/apiv2/careers', {
      headers: {
        'api_key': process.env.API_KEY // Ganti dengan API key Anda
      }
    });
    const careers = response.data;
    res.status(200).json(careers);
  } catch (error) {
    console.error('Error fetching careers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
