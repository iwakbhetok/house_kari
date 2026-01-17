import axios from 'axios';

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const response = await axios.get(process.env.API_URL + `/apiv2/careers?categoryId=${id}`, {
      headers: { 'api-key': process.env.API_KEY }
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch data', error: error.message });
  }
}
