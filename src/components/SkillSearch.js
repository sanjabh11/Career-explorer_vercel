// components/SkillSearch.js

import React, { useState } from 'react';
import { searchOccupations, getOccupationDetails } from '../utils/api';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { TextField, Button, CircularProgress, Typography, List, ListItem, ListItemText, Container, Paper, Box } from '@mui/material';

const SkillSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [selectedOccupation, setSelectedOccupation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const occupations = await searchOccupations(searchTerm);
      setResults(occupations);
    } catch (error) {
      setError('An error occurred while searching. Please try again.');
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
      setError('An error occurred while fetching occupation details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderList = (title, items, category) => {
    if (!items || items.length === 0) {
      return <Typography>No {title.toLowerCase()} information available.</Typography>;
    }
    return (
      <Box>
        <Typography variant="h6">{title}</Typography>
        <Typography>Average APO: {selectedOccupation.apoPercentage[category].toFixed(2)}%</Typography>
        <List>
          {items.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={item.name || item.title}
                secondary={`${item.description || ''} - APO: ${calculateAPO(item, category).toFixed(2)}%`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  };

  const renderAutomationAnalysis = (occupation) => {
    if (!occupation) return null;
    return (
      <Box>
        <Typography variant="h6">Automation Exposure Analysis</Typography>
        <Typography>Overall APO: {occupation.overallAPO.toFixed(2)}%</Typography>
        {Object.entries(occupation.apoPercentage).map(([category, apo]) => (
          <Typography key={category}>{category} APO: {apo.toFixed(2)}%</Typography>
        ))}
      </Box>
    );
  };

  const downloadExcel = () => {
    if (!selectedOccupation) return;

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);

    // Add occupation details to the worksheet
    XLSX.utils.sheet_add_json(worksheet, [
      { A: 'Occupation', B: selectedOccupation.title },
      { A: 'Description', B: selectedOccupation.description },
      { A: 'O*NET-SOC Code', B: selectedOccupation.code },
      {},  // Empty row for spacing
    ], { skipHeader: true, origin: 'A1' });

    // Add Automation Exposure Analysis
    XLSX.utils.sheet_add_json(worksheet, [
      { A: 'Automation Exposure Analysis' },
      { A: 'Overall APO', B: selectedOccupation.overallAPO.toFixed(2) + '%' },
      ...Object.entries(selectedOccupation.apoPercentage).map(([category, apo]) => ({ A: `${category} APO`, B: apo.toFixed(2) + '%' })),
      {},  // Empty row for spacing
    ], { skipHeader: true, origin: -1 });

    // Add detailed information for each category
    ['tasks', 'knowledge', 'skills', 'abilities', 'technology'].forEach(category => {
      XLSX.utils.sheet_add_json(worksheet, [{ A: category.charAt(0).toUpperCase() + category.slice(1) }], { skipHeader: true, origin: -1 });
      XLSX.utils.sheet_add_json(worksheet, [{ A: 'Name', B: 'Description', C: 'APO' }], { origin: -1 });
      const itemsWithAPO = selectedOccupation[category].map(item => ({
        A: item.name || item.title,
        B: item.description,
        C: calculateAPO(item, category).toFixed(2) + '%'
      }));
      XLSX.utils.sheet_add_json(worksheet, itemsWithAPO, { origin: -1 });
      XLSX.utils.sheet_add_json(worksheet, [{}], { origin: -1 });  // Empty row for spacing
    });

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Occupation Details');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${selectedOccupation.title}_details.xlsx`);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>O*NET Career Explorer</Typography>
      <TextField
        label="Search for occupations"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSearch} disabled={isLoading}>
        {isLoading ? <CircularProgress size={24} /> : 'Search'}
      </Button>
      {error && (
        <Typography color="error" variant="body2" gutterBottom>{error}</Typography>
      )}
      {results.length > 0 && (
        <List>
          {results.map(occupation => (
            <ListItem button key={occupation.code} onClick={() => handleOccupationSelect(occupation)}>
              <ListItemText primary={occupation.title} />
            </ListItem>
          ))}
        </List>
      )}
      {selectedOccupation && (
        <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
          <Typography variant="h5">{selectedOccupation.title}</Typography>
          {renderAutomationAnalysis(selectedOccupation)}
          {renderList('Tasks', selectedOccupation.tasks, 'tasks')}
          {renderList('Knowledge', selectedOccupation.knowledge, 'knowledge')}
          {renderList('Skills', selectedOccupation.skills, 'skills')}
          {renderList('Abilities', selectedOccupation.abilities, 'abilities')}
          {renderList('Technology Skills', selectedOccupation.technology, 'Technology Skills')}
          <Button variant="contained" color="secondary" onClick={downloadExcel} style={{ marginTop: '16px' }}>
            Download as Excel
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default SkillSearch;