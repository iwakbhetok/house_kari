import axios from 'axios';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const response = await axios.get(`https://prahwa.net/apiv2/recipes?id=${id}`, {
      headers: { 'api-key': 'mhHoCDQEPiYD7vU37K5AX0bKuP86a31wU2P8N86L' }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch data', error: error.message });
  }
}
