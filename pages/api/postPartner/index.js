// // pages/api/become-partners.js

// import axios from 'axios';
// import FormData from 'form-data';

// export default async function handler(req, res) {
//   if (req.method === 'POST') {
//     try {
//       const form = new FormData();

//       // Mengambil data dari body request
//       const { email, company_name, company_address, found_housekari_form, reason_to_become_reseller, company_type, name, phone_number } = req.body;

//       // Menambahkan data ke form
//       form.append('email', email || '');
//       form.append('company_name', company_name || '');
//       form.append('company_address', company_address || '');
//       form.append('found_housekari_form', found_housekari_form || '');
//       form.append('reason_to_become_reseller', reason_to_become_reseller || '');
//       form.append('company_type', company_type || '');
//       form.append('name', name || '');
//       form.append('phone_number', phone_number || '');

//       // Mengirim request POST ke API eksternal
//       const response = await axios.post('https://prahwa.net/apiv2/become-partners', form, {
//         headers: {
//           ...form.getHeaders(),
//           'Accept': 'application/json',
//           'api_key': 'mhHoCDQEPiYD7vU37K5AX0bKuP86a31wU2P8N86L',
//         },
//       });

//       // Mengirim response dari API eksternal ke client
//       res.status(response.status).json(response.data);
//     } catch (error) {
//       console.error('Error sending data to API:', error.response || error.message);
//       res.status(error.response?.status || 500).json({ error: error.response?.data || 'Something went wrong' });
//     }
//   } else {
//     // Method Not Allowed
//     res.setHeader('Allow', ['POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }



// pages/api/postForm.js
import axios from 'axios';
import querystring from 'querystring';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, company_name, company_address, found_housekari_form, reason_to_become_reseller, company_type, name, phone_number } = req.body;

      // Prepare the form-data body
      const formData = querystring.stringify({
        email, company_name, company_address, found_housekari_form, reason_to_become_reseller, company_type, name, phone_number
      });

      // Make a request to the external API
      const response = await axios.post(
        'https://prahwa.net/apiv2/become-partners',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'api_key': 'mhHoCDQEPiYD7vU37K5AX0bKuP86a31wU2P8N86L'
          }
        }
      );

      // Send the response back to the client
      res.status(200).json(response.data);
    } catch (error) {
      console.error('Error posting form data:', error);
      res.status(500).json({ message: 'Failed to submit form' });
    }
  } else {
    // Method Not Allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
