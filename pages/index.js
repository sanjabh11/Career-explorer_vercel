import React, { useState } from 'react';
import { searchOccupations, getOccupationDetails } from './api';
import { calculateOverallAPO } from './apoCalculator';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [occupations, setOccupations] = useState([]);
  const [selectedOccupation, setSelectedOccupation] = useState(null);
  const [apoResults, setApoResults] = useState(null);

  const handleSearch = async () => {
    const results = await searchOccupations(searchTerm);
    setOccupations(results);
  };

  const handleSelectOccupation = async (onetCode) => {
    const details = await getOccupationDetails(onetCode);
    setSelectedOccupation(details);
    const apo = calculateOverallAPO(details);
    setApoResults(apo);
  };

  return (
    <div>
      <h1>O*NET Career Explorer</h1>
      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        placeholder="Search for occupations" 
      />
      <button onClick={handleSearch}>Search</button>

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
          {/* Add more details as needed */}
        </div>
      )}
    </div>
  );
}

export default App;