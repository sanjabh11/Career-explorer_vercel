import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const taxonomyPath = path.join(process.cwd(), 'data', 'taxonomy.json');
  const taxonomyData = JSON.parse(fs.readFileSync(taxonomyPath, 'utf8'));

  // Simulate fetching job data
  const jobData = [
    { title: "Software Engineer", skills: ["Programming", "Data Analysis"] },
    { title: "Project Manager", skills: ["Project Management", "Finance"] },
  ];

  // Calculate APO (simplified example)
  const jobsWithAPO = jobData.map(job => {
    const apo = job.skills.filter(skill => 
      taxonomyData.categories.some(category => 
        category.skills.includes(skill)
      )
    ).length / job.skills.length;

    return { ...job, apo };
  });

  res.status(200).json(jobsWithAPO);
}