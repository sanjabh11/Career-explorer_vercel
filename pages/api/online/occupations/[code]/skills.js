import axios from 'axios';

export default async function handler(req, res) {
  const { code } = req.query;
  
  try {
    const axiosConfig = {
      auth: {
        username: process.env.ONET_USERNAME,
        password: process.env.ONET_PASSWORD
      }
    };

    const response = await axios.get(`https://services.onetcenter.org/ws/online/occupations/${code}/skills`, axiosConfig);

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(error.response?.status || 500).json({ error: 'An error occurred while fetching skills from O*NET' });
  }
}