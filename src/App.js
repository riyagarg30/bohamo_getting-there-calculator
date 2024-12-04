import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material';
import theme from './theme';  // Your custom theme
import FlightSearch from './FlightSearch';  // Path to FlightSearch

const App = () => {
  const [routes, setRoutes] = useState([]);

  const handleSearchResults = (results) => {
    setRoutes(results);
    console.log('Routes:', results); // Debugging route results
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', padding: 2 }}>
        
        <FlightSearch onSearchResults={handleSearchResults} routes={routes} />
      </Box>
    </ThemeProvider>
  );
};

export default App;