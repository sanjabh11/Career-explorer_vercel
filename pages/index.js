import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await axios.get('/api/jobs');
      setJobs(response.data);
    };
    fetchJobs();
  }, []);

  return (
    <div>
      <h1>GenAI Readiness Career Explorer</h1>
      <p>Explore jobs and their Automation Potential Opportunities (APO):</p>
      <ul>
        {jobs.map((job, index) => (
          <li key={index}>
            {job.title} - APO: {(job.apo * 100).toFixed(2)}%
          </li>
        ))}
      </ul>
    </div>
  );
}