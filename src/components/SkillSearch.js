import React, { useState } from 'react';
import { fetchSkills } from '../utils/api';

const SkillSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const data = await fetchSkills(query);
      setResults(data.career);
    } catch (error) {
      console.error('Error searching skills:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a skill"
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {results.map((skill) => (
          <li key={skill.code}>{skill.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SkillSearch;