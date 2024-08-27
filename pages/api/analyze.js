// pages/api/analyze.js
import fs from 'fs';
import path from 'path';

// Load taxonomy data
const taxonomyPath = path.join(process.cwd(), 'data', 'taxonomy.json');
const taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, 'utf8'));

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { jobDescription } = req.body;
      
      // Simple skill extraction (you may want to use a more sophisticated NLP approach)
      const skills = extractSkills(jobDescription, taxonomy);
      
      // Calculate APO (this is a simplified version)
      const apo = calculateAPO(skills);
      
      res.status(200).json({ skills, apo });
    } catch (error) {
      res.status(500).json({ error: 'Error analyzing job description' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function extractSkills(jobDescription, taxonomy) {
  return taxonomy.filter(skill => 
    jobDescription.toLowerCase().includes(skill.toLowerCase())
  );
}

function calculateAPO(skills) {
  // This is a placeholder calculation. You should implement a more accurate method.
  return Math.min(100, skills.length * 10);
}