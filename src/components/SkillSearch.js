import React, { useState } from 'react';
import { fetchSkills, getOccupationDetails } from '../utils/api';

const SkillSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedOccupation, setSelectedOccupation] = useState(null);
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
      setError('Failed to search skills. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOccupationSelect = async (occupation) => {
    setIsLoading(true);
    setError(null);
    try {
      const details = await getOccupationDetails(occupation.code);
      setSelectedOccupation({ ...occupation, ...details });
    } catch (error) {
      setError('Failed to fetch occupation details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderList = (title, items) => (
    <>
      <h3>{title}:</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.name || item.title}: {item.description}
            {item.value && <span> (Value: {item.value})</span>}
          </li>
        ))}
      </ul>
    </>
  );

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
          <li key={skill.code} onClick={() => handleOccupationSelect(skill)}>
            {skill.title}
          </li>
        ))}
      </ul>
      {selectedOccupation && (
        <div>
          <h2>{selectedOccupation.title}</h2>
          <p>{selectedOccupation.description}</p>
          {renderList('Tasks', selectedOccupation.tasks)}
          {renderList('Knowledge', selectedOccupation.knowledge)}
          {renderList('Skills', selectedOccupation.skills)}
          {renderList('Abilities', selectedOccupation.abilities)}
          {renderList('Technology', selectedOccupation.technology)}
        </div>
      )}
    </div>
  );
};

export default SkillSearch;