import axios from 'axios';

export default async function handler(req, res) {
  const { code } = req.query;
  
  try {
    const axiosConfig = {
      auth: {
        username: process.env.NEXT_PUBLIC_ONET_USERNAME,
        password: process.env.NEXT_PUBLIC_ONET_PASSWORD
      }
    };

    const [
      detailsResponse,
      tasksResponse,
      knowledgeResponse,
      skillsResponse,
      abilitiesResponse,
      technologyResponse
    ] = await Promise.all([
      axios.get(`https://services.onetcenter.org/ws/online/occupations/${code}`, axiosConfig),
      axios.get(`https://services.onetcenter.org/ws/online/occupations/${code}/tasks`, axiosConfig),
      axios.get(`https://services.onetcenter.org/ws/online/occupations/${code}/knowledge`, axiosConfig),
      axios.get(`https://services.onetcenter.org/ws/online/occupations/${code}/skills`, axiosConfig),
      axios.get(`https://services.onetcenter.org/ws/online/occupations/${code}/abilities`, axiosConfig),
      axios.get(`https://services.onetcenter.org/ws/online/occupations/${code}/technology`, axiosConfig)
    ]);

    res.status(200).json({
      details: detailsResponse.data,
      tasks: tasksResponse.data.task || [],
      knowledge: knowledgeResponse.data.knowledge || [],
      skills: skillsResponse.data.skill || [],
      abilities: abilitiesResponse.data.ability || [],
      technology: technologyResponse.data.technology || []
    });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'An error occurred while fetching occupation details from O*NET' });
  }
}