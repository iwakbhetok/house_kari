import axios from 'axios';

export default async function handler(req, res) {
  // Extract the query parameter from the URL
  const { id } = req.query;

  // Ensure the query parameter is provided
  if (!id) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    // Make the request to the external API
    const response = await axios.get(`https://prahwa.net/apiv2/search`, {
      params: { key: id },
      headers: { 'api-key': 'mhHoCDQEPiYD7vU37K5AX0bKuP86a31wU2P8N86L' }
    });

    // Return the response data
    res.status(200).json(response.data);
  } catch (error) {
    // Handle errors appropriately
    console.error('Error fetching data:', error.message);
    res.status(500).json({ message: 'Failed to fetch data', error: error.message });
  }
}
