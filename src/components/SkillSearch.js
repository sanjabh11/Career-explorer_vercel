import React, { useState } from 'react';
import { fetchSkills } from '../utils/api';

const SkillSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchSkills(query);
      setResults(data.career || []);
    } catch (error) {
      console.error('Error searching skills:', error);
      setError('Failed to search skills. Please try again.');
    } finally {
      setIsLoading(false);
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <ul>
        {results.map((skill) => (
          <li key={skill.code}>{skill.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SkillSearch;