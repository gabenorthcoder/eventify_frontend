import * as React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import { TextField, Button, Box, Typography, Alert, MenuItem } from "@mui/material";
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import AppTheme from '../Auth/theme/AppTheme';
import ColorModeSelect from '../Auth/theme/ColorModeSelect';
import {useNavigate } from 'react-router-dom';
import apiService from "../../services/apiService";

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

type Role = "STAFF" | "USER";

export default function RegisterAdmin(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [roleError, setRoleError] = React.useState(false);
  const [roleErrorMessage, setRoleErrorMessage] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [role, setRole] = React.useState<Role>("STAFF");
  const navigate = useNavigate();

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const name = document.getElementById('name') as HTMLInputElement;

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
    if (!role) {
        setRoleError(true);
        setRoleErrorMessage('Role is required.');
        isValid = false;
      } else {
        setRoleError(false);
        setRoleErrorMessage('');
      }
      
    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  

    if (!validateInputs()) {
      return; 
    }
  
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email'));
    const password = String(data.get('password'));
    const firstName = (data.get('name') as string)?.split(' ')[0] || '';
    const lastName = (data.get('name') as string)?.split(' ').pop() || '';
  
    try {
        const token = localStorage.getItem("token") || "";
        const roleMapping: Record<Role, number> = { STAFF: 1, USER: 2 };
        await apiService.registerAdmin({ email, password, firstName, lastName, role: roleMapping[role] }, token);;
  
      setSuccessMessage(`${role === "STAFF" ? "Staff" : "User"}  Registration successful!`);
      setTimeout(() => {
     
        navigate(`/admin/dashboard`, { state: { from: "userRegistration" } });
      }, 2000);
    } catch (err: any) {
 
      if (err.response && err.response.status === 400 && err.response.data.message) {
        setError(err.response.data.message || `${role === "STAFF" ? "Staff" : "User"} registration failed.`);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };
  


  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', bottom: '5rem', right: '1rem' }} />

  
      {successMessage && (
        <Alert severity="success">{successMessage}</Alert>
      )}

      {error && (
        <Alert severity="error">{error}</Alert>
      )}

      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, fontFamily: 'apple chancery, cursive', textAlign: "center", fontSize: 'clamp(2rem, 10vw, 2.15rem)'}}>
            Eventify
          </Typography>
          <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: "center" }}>
            Register User
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
        
            <FormControl error={roleError}>
  <FormLabel htmlFor="role">Role</FormLabel>
  <TextField
  select
  fullWidth
  value={role}
  onChange={(e) => setRole(e.target.value as Role)}
  error={roleError}
  helperText={roleErrorMessage}
  variant="outlined"
>
  <MenuItem value="STAFF">STAFF</MenuItem>
  <MenuItem value="USER">USER</MenuItem>
</TextField>

</FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Create Account
            </Button>
          </Box>

        </Card>
      </SignUpContainer>
    </AppTheme>
  );
}
