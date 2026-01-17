import axios from 'axios';
import FormData from 'form-data';
import multiparty from 'multiparty';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parser
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(500).json({ message: 'Failed to parse form data' });
      }

      try {
        // Create an instance of FormData
        const formData = new FormData();

        // Append the fields to the FormData instance
        formData.append('title', fields.title[0] || 'Review');
        formData.append('description', fields.description[0]);
        formData.append('name', fields.name[0]);
        formData.append('phone_number', fields.phone_number[0]);

        // Append the image file if it exists
        if (files.image && files.image[0]) {
          const imageFilePath = files.image[0].path;
          const imageStream = fs.createReadStream(imageFilePath);

          formData.append('image', imageStream, {
            filename: files.image[0].originalFilename,
            contentType: files.image[0].headers['content-type'],
          });
        }

        // Make a request to the external API
        const response = await axios.post('https://prahwa.net/apiv2/review', formData, {
          headers: {
            ...formData.getHeaders(),
            'api-key': 'mhHoCDQEPiYD7vU37K5AX0bKuP86a31wU2P8N86L',
          },
        });

        // Send the response back to the client
        res.status(200).json(response.data);
      } catch (error) {
        console.error('Error posting form data:', error);
        res.status(500).json({ message: 'Failed to submit form', error: error.message });
      }
    });
  } else {
    // Method Not Allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
