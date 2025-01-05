import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import CssBaseline from '@mui/material/CssBaseline';

import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { Alert} from '@mui/material';
import { styled } from '@mui/material/styles';

import AppTheme from '../Auth/theme/AppTheme';
import ColorModeSelect from '../Auth/theme/ColorModeSelect';
import { useNavigate } from 'react-router-dom';
import apiService from "../../services/apiService";

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
  },
}));

export default function StaffLogin(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    

    const isValid = validateInputs();
    if (!isValid) {
      return;
    }

    const data = new FormData(event.currentTarget);
    const validEmail = String(data.get('email'));
    const validPassword = String(data.get('password'));

    try {
        const response = await apiService.login(validEmail, validPassword, 1);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response));
      setSuccessMessage('Login successful!');
      navigate("/staff/dashboard");
     } catch (err: any) {
      if (err.response && err.response.status === 400 && err.response.data.message || err.response.status === 401) {
        setError(err.response.data.message || "Login failed");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };


  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <ColorModeSelect sx={{ position: 'fixed', bottom: '5rem', right: '1rem' }} />
        
        {successMessage && (
          <Alert severity="success">{successMessage}</Alert>
        )}
        
        {error && (
          <Alert severity="error">{error}</Alert>
        )}
        
        <Card variant="outlined">
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, fontFamily: 'apple chancery, cursive', textAlign: "center", fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}>
            Eventify
          </Typography>
          
          <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: "center" }}>
            Staff Login
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>   
            <Button type="submit" fullWidth variant="contained">
              Login
            </Button>
            
      
          </Box>
          
  
       
        </Card>
      </SignInContainer>
    </AppTheme>
  );
}
