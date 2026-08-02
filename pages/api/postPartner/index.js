import axios from 'axios';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const {
      email,
      company_name,
      company_address,
      found_housekari_form,
      reason_to_become_reseller,
      company_type,
      name,
      phone_number,
    } = req.body;

    const response = await axios.post(`${CMS_URL}/api/become-a-partner`, {
      name,
      email,
      phoneNumber: phone_number,
      companyName: company_name,
      companyType: company_type,
      companyAddress: company_address,
      foundFrom: found_housekari_form,
      reason: reason_to_become_reseller,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error sending data to CMS:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: error.response?.data || 'Something went wrong' });
  }
}
