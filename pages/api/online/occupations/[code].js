import axios from 'axios';
import fs from 'fs';
import path from 'path';

const apoCategoriesPercentages = {
  tasks: {
    "Analyzing Data": 65, "Preparing Reports": 55, "Coordinating Activities": 40,
    "Evaluating Information": 35, "Developing Objectives": 25, "Communicating": 30,
    "Monitoring Processes": 50, "Training": 35, "Problem Solving": 45,
    "Updating Knowledge": 60, "Programming": 65, "Debugging": 55, "Testing": 50, "Documenting": 45
  },
  knowledge: {
    "Administration and Management": 35, "Customer and Personal Service": 40,
    "Engineering and Technology": 50, "Mathematics": 70, "English Language": 55,
    "Computers and Electronics": 60, "Education and Training": 40, "Psychology": 30,
    "Law and Government": 45, "Production and Processing": 55, "Design": 45, "Geography": 40
  },
  skills: {
    "Active Listening": 35, "Critical Thinking": 40, "Reading Comprehension": 60,
    "Speaking": 25, "Writing": 55, "Active Learning": 50, "Monitoring": 65,
    "Social Perceptiveness": 20, "Time Management": 45, "Complex Problem Solving": 40,
    "Programming": 65, "Systems Analysis": 55, "Quality Control Analysis": 50,
    "Judgment and Decision Making": 45
  },
  abilities: {
    "Oral Comprehension": 40, "Written Comprehension": 65, "Oral Expression": 25,
    "Written Expression": 55, "Fluency of Ideas": 35, "Originality": 30,
    "Problem Sensitivity": 55, "Deductive Reasoning": 50, "Inductive Reasoning": 60,
    "Information Ordering": 70, "Near Vision": 40, "Speech Recognition": 35
  },
  "Technology Skills": {
    "Development Environment": 55, "Presentation Software": 50,
    "Object Oriented Development": 60, "Web Platform Development": 65,
    "Database Management": 70, "Operating System": 45,
    "Data Base User Interface": 55, "Compiler and Decompiler": 50,
    "Enterprise Resource Planning": 60, "Enterprise Application Integration": 65
  }
};

function calculateAPO(item, category) {
  if (!item || (!item.name && !item.title)) {
    console.warn(`Invalid item in category ${category}:`, item);
    return 0;
  }

  const itemName = item.name || item.title || '';
  const itemDescription = item.description || '';
  const fullText = `${itemName} ${itemDescription}`.toLowerCase();

  for (const [key, value] of Object.entries(apoCategoriesPercentages[category] || {})) {
    if (fullText.includes(key.toLowerCase())) {
      return value;
    }
  }

  const averageCategoryAPO = Object.values(apoCategoriesPercentages[category] || {}).reduce((a, b) => a + b, 0) / Object.values(apoCategoriesPercentages[category] || {}).length || 0;
  return averageCategoryAPO;
}

function getAverageAPO(items, category) {
  if (!items || items.length === 0) {
    return 0;
  }
  const totalAPO = items.reduce((sum, item) => sum + calculateAPO(item, category), 0);
  return totalAPO / items.length;
}

export default async function handler(req, res) {
  const { code } = req.query;
  
  try {
    console.log('API route called with code:', code);
    const axiosConfig = {
      auth: {
        username: process.env.ONET_USERNAME,
        password: process.env.ONET_PASSWORD
      }
    };

    const [details, tasks, skills, abilities, knowledge, technology] = await Promise.all([
      axios.get(`https://services.onetcenter.org/ws/online/occupations/${code}`, axiosConfig),
      axios.get(`https://services.onetcenter.org/ws/online/occupations/${code}/details/tasks`, axiosConfig),
      axios.get(`https://services.onetcenter.org/ws/online/occupations/${code}/details/skills`, axiosConfig),
      axios.get(`https://services.onetcenter.org/ws/online/occupations/${code}/details/abilities`, axiosConfig),
      axios.get(`https://services.onetcenter.org/ws/online/occupations/${code}/details/knowledge`, axiosConfig),
      axios.get(`https://services.onetcenter.org/ws/online/occupations/${code}/details/technology`, axiosConfig)
    ]);

    const apoPercentage = {
      tasks: getAverageAPO(tasks.data.task, 'tasks'),
      knowledge: getAverageAPO(knowledge.data.knowledge, 'knowledge'),
      skills: getAverageAPO(skills.data.skill, 'skills'),
      abilities: getAverageAPO(abilities.data.ability, 'abilities'),
      technology: getAverageAPO(technology.data.technology, 'Technology Skills')
    };

    const overallAPO = Object.values(apoPercentage).reduce((sum, apo) => sum + apo, 0) / Object.keys(apoPercentage).length;

    console.log('Fetched data:', JSON.stringify(details.data));

    res.status(200).json({
      details: details.data,
      tasks: tasks.data.task || [],
      skills: skills.data.skill || [],
      abilities: abilities.data.ability || [],
      knowledge: knowledge.data.knowledge || [],
      technology: technology.data.technology || [],
      apoPercentage,
      overallAPO
    });
  } catch (error) {
    console.error('Detailed error:', error);
    handleApiError(error, res);
  }
}

function handleApiError(error, res) {
  if (error.response) {
    switch (error.response.status) {
      case 400:
        res.status(400).json({ error: 'Bad request. Please check your input.' });
        break;
      case 401:
        res.status(401).json({ error: 'Unauthorized. Please check your API credentials.' });
        break;
      case 404:
        res.status(404).json({ error: 'Occupation not found. Please check the occupation code.' });
        break;
      case 422:
        res.status(422).json({ error: 'The occupation code provided is not valid or the data is incomplete.' });
        break;
      case 429:
        res.status(429).json({ error: 'Too many requests. Please try again later.' });
        break;
      default:
        res.status(500).json({ error: 'An error occurred while fetching data from O*NET.' });
    }
  } else {
    res.status(500).json({ error: 'Network error. Please check your internet connection.' });
  }
}
