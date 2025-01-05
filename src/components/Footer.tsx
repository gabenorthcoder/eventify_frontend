// Footer.tsx
import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <footer>
    <Box sx={{ bgcolor:"#333", color: '#fff', width: '100%', margin: 0, pb: 2, textAlign: 'center' }}>
      <Typography variant="body2">
        {'© '}
        <Link href="/" color="inherit" underline="none">
          Eventify
        </Link>{' '}
        {new Date().getFullYear()}.
      </Typography>
      <Typography variant="body2">
        <Link href="/privacy" color="inherit" underline="none">
          Privacy Policy
        </Link>{' | '}
        <Link href="/terms" color="inherit" underline="none">
          Terms of Service
        </Link>
      </Typography>
    </Box>
    </footer>
  );
};

export default Footer;
