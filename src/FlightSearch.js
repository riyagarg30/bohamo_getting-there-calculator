import React, { useState } from 'react';
import axios from 'axios';
import { Button, Select, MenuItem, Box, Drawer, List, ListItem, ListItemText, FormControl, InputLabel, Typography } from '@mui/material';
import useStyles from './styles'; // Import the styles
import FlightMap from './FlightMap'; // Import the new FlightMap component

const FlightSearch = () => {
  const classes = useStyles(); // Apply styles
  const [source, setSource] = useState('DEL');
  const [destination, setDestination] = useState('JFK');
  const [routes, setRoutes] = useState([]); // State to hold the list of routes

  const [sourceCoords, setSourceCoords] = useState({ lat: 28.6139, lng: 77.209 }); // Default source: New Delhi
  const [destinationCoords, setDestinationCoords] = useState({ lat: 40.7128, lng: -74.006 }); // Default destination: New York

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/get-routes?source=${source}&destination=${destination}`
      );
      setRoutes(response.data.routes); // Update the routes state with fetched data
    } catch (error) {
      console.error('Error fetching flight routes:', error);
    }

    // Update coordinates based on selected source and destination
    if (source === 'DEL' && destination === 'JFK') {
      setSourceCoords({ lat: 28.6139, lng: 77.209 });
      setDestinationCoords({ lat: 40.7128, lng: -74.006 });
    } else if (source === 'JFK' && destination === 'DEL') {
      setSourceCoords({ lat: 40.7128, lng: -74.006 });
      setDestinationCoords({ lat: 28.6139, lng: 77.209 });
    }
  };

  return (
    <Box className={classes.container}>
      {/* Side Panel */}
      <Drawer
        className={classes.sidePanel}
        variant="permanent" // Permanent side panel
        anchor="left"
      >
        <List>
          <ListItem>
            <ListItemText primary="Flight Search" />
          </ListItem>
          <ListItem>
            <FormControl fullWidth>
              <InputLabel id="source-label">Source</InputLabel>
              <Select
                labelId="source-label"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                label="Source"
              >
                <MenuItem value="DEL">New Delhi (DEL)</MenuItem>
                <MenuItem value="JFK">New York City (JFK)</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
          <ListItem>
            <FormControl fullWidth>
              <InputLabel id="destination-label">Destination</InputLabel>
              <Select
                labelId="destination-label"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                label="Destination"
              >
                <MenuItem value="DEL">New Delhi (DEL)</MenuItem>
                <MenuItem value="JFK">New York City (JFK)</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              className={classes.button}
            >
              Search Flights
            </Button>
          </ListItem>

          {/* Display the list of routes below the button */}
          {routes.length > 0 ? (
            <List>
              {routes.map((route) => (
                <ListItem key={route._id}>
                  <ListItemText
                    primary={`${route.airline} (${route.flight_id})`}
                    secondary={`Departure: ${route.departure} at ${route.departure_time}, Arrival: ${route.destination} at ${route.arrival_time}, Type: ${route.flight_type}`}
                  />
                  {route.flight_type === 'Connecting' && (
                    <Typography variant="body2">
                      Connecting via: {route.connecting_airport} at {route.connecting_time}
                    </Typography>
                  )}
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              No routes found. Try another search.
            </Typography>
          )}
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Box component="main" className={classes.mainContent}>
        {/* <Typography variant="h4" className={classes.title}>
          Flight Routes
        </Typography> */}

        {/* Map Component */}
        <FlightMap
          sourceCoords={sourceCoords}
          destinationCoords={destinationCoords}
          source={source}
          destination={destination}
          routes = {routes}
        />
      </Box>
    </Box>
  );
};

export default FlightSearch;
