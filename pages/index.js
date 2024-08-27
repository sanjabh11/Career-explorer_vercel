import React, { useState, useEffect } from 'react';
import SkillSearch from '../src/components/SkillSearch';
import { searchOccupations, getOccupationDetails } from '../src/utils/api';
import { calculateOverallAPO } from '../src/utils/apoCalculator';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [occupations, setOccupations] = useState([]);
  const [selectedOccupation, setSelectedOccupation] = useState(null);
  const [apoResults, setApoResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Home component mounted');
  }, []);

  const handleSearch = async () => {
    console.log('Searching for:', searchTerm);
    setIsLoading(true);
    setError(null);
    try {
      const results = await searchOccupations(searchTerm);
      console.log('Search results:', results);
      setOccupations(results);
    } catch (error) {
      console.error('Error in search:', error);
      setError('Failed to search occupations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOccupation = async (onetCode) => {
    console.log('Selected occupation code:', onetCode);
    setIsLoading(true);
    setError(null);
    try {
      const details = await getOccupationDetails(onetCode);
      console.log('Occupation details:', details);
      setSelectedOccupation(details);
      const apo = calculateOverallAPO(details);
      console.log('APO results:', apo);
      setApoResults(apo);
    } catch (error) {
      console.error('Error in occupation selection:', error);
      setError('Failed to fetch occupation details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>GenAI Readiness Career Explorer</h1>
      <SkillSearch />

      <div>
        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Search for occupations" 
        />
        <button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>

        {error && <p style={{color: 'red'}}>{error}</p>}

        {occupations.length > 0 && (
          <ul>
            {occupations.map(occupation => (
              <li key={occupation.code} onClick={() => handleSelectOccupation(occupation.code)}>
                {occupation.title}
              </li>
            ))}
          </ul>
        )}

        {selectedOccupation && apoResults && (
          <div>
            <h2>{selectedOccupation.details.title}</h2>
            <p>Overall APO: {apoResults.overall.toFixed(2)}%</p>
            {apoResults.categories.map(category => (
              <p key={category.name}>{category.name} APO: {category.apo.toFixed(2)}%</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;