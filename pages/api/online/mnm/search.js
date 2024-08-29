import axios from 'axios';

export default async function handler(req, res) {
  const { keyword } = req.query;
  
  if (!process.env.ONET_USERNAME || !process.env.ONET_PASSWORD) {
    return res.status(500).json({ error: 'O*NET credentials are not configured' });
  }

  try {
    const response = await axios.get(`https://services.onetcenter.org/ws/mnm/search`, {
      params: { keyword },
      auth: {
        username: process.env.ONET_USERNAME,
        password: process.env.ONET_PASSWORD
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(error.response?.status || 500).json({ error: 'An error occurred while fetching data from O*NET' });
  }
}