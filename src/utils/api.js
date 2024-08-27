// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://services.onetcenter.org/ws/',
  auth: {
    username: process.env.REACT_APP_ONET_USERNAME,
    password: process.env.REACT_APP_ONET_PASSWORD
  }
});

export const searchOccupations = async (query) => {
  try {
    const response = await api.get(`online/search?keyword=${query}`);
    return response.data.occupation;
  } catch (error) {
    console.error('Error searching occupations:', error);
    throw error;
  }
};

export const getOccupationDetails = async (onetCode) => {
  try {
    const details = await api.get(`online/occupations/${onetCode}`);
    const tasks = await api.get(`online/occupations/${onetCode}/tasks`);
    const knowledge = await api.get(`online/occupations/${onetCode}/knowledge`);
    const skills = await api.get(`online/occupations/${onetCode}/skills`);
    const abilities = await api.get(`online/occupations/${onetCode}/abilities`);
    const technology = await api.get(`online/occupations/${onetCode}/technology`);

    return {
      details: details.data,
      tasks: tasks.data.task,
      knowledge: knowledge.data.knowledge,
      skills: skills.data.skill,
      abilities: abilities.data.ability,
      technology: technology.data.technology
    };
  } catch (error) {
    console.error('Error fetching occupation details:', error);
    throw error;
  }
};