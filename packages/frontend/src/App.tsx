import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import { FC } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Navigation from './navigation/Navigation';
import { routes } from './navigation/routes';
import { AuthProvider } from './store/AuthProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: {
      main: '#8884d8',
    },
    secondary: {
      main: '#82ca9d',
    },
  },
});

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <Container className="main" component="main" maxWidth="md">
            <AuthProvider>
              <Navigation routes={routes} />
            </AuthProvider>
          </Container>
        </ThemeProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};

export default App;
