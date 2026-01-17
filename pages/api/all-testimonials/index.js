// File: pages/api/testimonials.js

import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get(process.env.API_URL + '/apiv2/review', {
      headers: {
        'api-key': process.env.API_KEY // Ganti dengan API key Anda
      }
    });
    const testimonial = response.data;
    res.status(200).json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
