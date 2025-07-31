import React, { useState } from 'react';
import {
  CssBaseline,
  Container,
  Typography,
  createTheme,
  ThemeProvider,
  Box,
} from '@mui/material';
import InvestorsTable from './components/InvestorsTable';
import CommitmentsView from './components/CommitmentsView';

// A simple theme for a professional look
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0052cc',
    },
    background: {
      default: '#f4f5f7',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
  },
});

const App: React.FC = () => {
  const [selectedInvestorId, setSelectedInvestorId] = useState<number | null>(null);

  const handleInvestorSelect = (investorId: number) => {    
    setSelectedInvestorId(investorId);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Investor Dashboard
        </Typography>

        <Box sx={{ my: 4 }}>
          <InvestorsTable onInvestorSelect={handleInvestorSelect} />
        </Box>

        {/* --- Conditionally render the CommitmentsView --- */}
        {selectedInvestorId && (
          <Box sx={{ my: 4 }}>
            <CommitmentsView investorId={selectedInvestorId} />
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;