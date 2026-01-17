import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://prahwa.net/apiv2/products', {
      headers: {
        'api-key': 'mhHoCDQEPiYD7vU37K5AX0bKuP86a31wU2P8N86L'
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
