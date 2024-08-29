import axios from 'axios';

export default async function handler(req, res) {
  const { keyword } = req.query;
  try {
    const response = await axios.get(`https://services.onetcenter.org/ws/online/search?keyword=${keyword}`, {
      auth: {
        username: process.env.NEXT_PUBLIC_ONET_USERNAME,
        password: process.env.NEXT_PUBLIC_ONET_PASSWORD
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data from O*NET:', error);
    res.status(error.response?.status || 500).json({ error: 'Error fetching data from O*NET' });
  }
}