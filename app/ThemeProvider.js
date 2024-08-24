// app/ThemeProvider.js
'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';

const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2', // Blue color for primary elements
      },
      secondary: {
        main: '#dc004e', // Pink color for secondary elements
      },
      background: {
        default: '#fafafa', // Default background color
      },
      text: {
        primary: '#333', // Text color
      },
    },
    typography: {
      fontFamily: '"Inter", Arial, sans-serif', // Font family
      h1: {
        fontSize: '2rem', // Customize header styles
      },
      body1: {
        fontSize: '1rem', // Customize body text styles
      },
    },
    shape: {
      borderRadius: 8, // Customize border radius for components
    },
    components: {
      // Customize specific components here if needed
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 4, // Override button border radius
            textTransform: 'none', // Prevent uppercase text transformation
          },
        },
      },
      // Add more component customizations here
    },
  });

export default function CustomThemeProvider({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
