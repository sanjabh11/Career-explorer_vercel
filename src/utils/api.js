import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Authorization': `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_ONET_USERNAME}:${process.env.NEXT_PUBLIC_ONET_PASSWORD}`).toString('base64')}`
  }
});

export const fetchSkills = async (query) => {
  try {
    console.log('Fetching skills for query:', query);
    const response = await api.get(`mnm/search?keyword=${query}`);
    console.log('API response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching skills:', error.response || error);
    throw error;
  }
};

export const getOccupationDetails = async (onetCode) => {
  try {
    console.log('Fetching occupation details for:', onetCode);
    const details = await api.get(`online/occupations/${onetCode}`);
    const tasks = await api.get(`online/occupations/${onetCode}/tasks`);
    const knowledge = await api.get(`online/occupations/${onetCode}/knowledge`);
    const skills = await api.get(`online/occupations/${onetCode}/skills`);
    const abilities = await api.get(`online/occupations/${onetCode}/abilities`);
    const technology = await api.get(`online/occupations/${onetCode}/technology`);

    return {
      details: details.data,
      tasks: tasks.data.task || [],
      knowledge: knowledge.data.knowledge || [],
      skills: skills.data.skill || [],
      abilities: abilities.data.ability || [],
      technology: technology.data.technology || []
    };
  } catch (error) {
    console.error('Error fetching occupation details:', error.response || error);
    throw error;
  }
};

export const searchOccupations = async (query) => {
  try {
    console.log('Searching occupations for query:', query);
    const response = await api.get(`online/search?keyword=${query}`);
    console.log('Search occupations response:', response);
    return response.data.occupation || [];
  } catch (error) {
    console.error('Error searching occupations:', error.response || error);
    throw error;
  }
};