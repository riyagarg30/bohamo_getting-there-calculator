// theme.js
import { createTheme } from '@mui/material/styles';

// Define a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue color for primary actions
    },
    secondary: {
      main: '#ff9800', // Orange color for secondary actions
    },
    background: {
      default: '#f5f5f5', // Light background color for the app
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Set font family
    h3: {
      fontWeight: 700, // Make heading 3 bold
    },
    body1: {
      fontSize: '1rem', // Adjust default body text size
    },
  },
  spacing: 8, // Define spacing unit (default is 8px)
});

export default theme;
