// utils/api.js

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

// ... other functions ...S

export const loadTaxonomy = async () => {
  try {
    const response = await axios.get('/data/taxonomy.json');
    return response.data;
  } catch (error) {
    console.error('Error loading taxonomy:', error);
    throw error;
  }
};

export const getOccupationDetails = async (onetCode) => {
  try {
    console.log('Fetching occupation details for:', onetCode);
    const response = await api.get(`/online/occupations/${onetCode}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching occupation details:', error.response || error);
    handleApiError(error);
  }
};

export const searchOccupations = async (query) => {
  try {
    console.log('Searching occupations for query:', query);
    const username = process.env.NEXT_PUBLIC_ONET_USERNAME; // Ensure this is defined
    const password = process.env.NEXT_PUBLIC_ONET_PASSWORD; // Ensure this is defined
    const response = await api.get(`/online/search?keyword=${encodeURIComponent(query)}`, {
      auth: {
        username: username,
        password: password
      }
    });
    console.log('Search occupations response:', response);
    return response.data.occupation || [];
  } catch (error) {
    console.error('Error searching occupations:', error.response || error);
    handleApiError(error);
  }
};



function handleApiError(error) {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        throw new Error('Bad request. Please check your input.');
      case 401:
        throw new Error('Unauthorized. Please check your API credentials.');
      case 404:
        throw new Error('Occupation not found. Please check the occupation code.');
      case 422:
        throw new Error('The occupation code provided is not valid or the data is incomplete.');
      case 429:
        throw new Error('Too many requests. Please try again later.');
      default:
        throw new Error('An error occurred while fetching data from O*NET.');
    }
  } else {
    throw new Error('Network error. Please check your internet connection.');
  }
}