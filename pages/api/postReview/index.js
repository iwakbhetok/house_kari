import axios from 'axios';
import FormData from 'form-data';
import multiparty from 'multiparty';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

function textToLexical(text) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          textFormat: 0,
          children: [
            {
              type: 'text',
              format: 0,
              version: 1,
              text: text || '',
            },
          ],
        },
      ],
    },
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form data:', err);
      return res.status(500).json({ message: 'Failed to parse form data' });
    }

    try {
      // Upload image to CMS media library if provided
      let imageMediaId = null;
      if (files.image && files.image[0]) {
        const imageFile = files.image[0];
        const mediaForm = new FormData();
        mediaForm.append('file', fs.createReadStream(imageFile.path), {
          filename: imageFile.originalFilename,
          contentType: imageFile.headers['content-type'],
        });

        const mediaRes = await axios.post(`${CMS_URL}/api/media`, mediaForm, {
          headers: { ...mediaForm.getHeaders() },
        });
        imageMediaId = mediaRes.data?.doc?.id;
      }

      // Build review payload
      const descText = fields.description?.[0] || '';
      const reviewData = {
        name: fields.name?.[0] || '',
        phone: fields.phone_number?.[0] || '',
        title: fields.title?.[0] || 'Review',
        description: textToLexical(descText),
        date: new Date().toISOString(),
        isApproved: false,
      };

      if (imageMediaId) {
        reviewData.images = [{ image: imageMediaId }];
      }

      const response = await axios.post(`${CMS_URL}/api/reviews`, reviewData, {
        headers: { 'Content-Type': 'application/json' },
      });

      res.status(200).json({ success: true, data: response.data });
    } catch (error) {
      console.error('Error posting review:', error.response?.data || error.message);
      res.status(500).json({ message: 'Failed to submit review', error: error.message });
    }
  });
}
