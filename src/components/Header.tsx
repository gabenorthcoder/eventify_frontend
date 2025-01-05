import * as React from 'react';
import { Link, useNavigate } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const Header: React.FC = () => {
  const [auth, setAuth] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [user,setUser] = React.useState<string | null>(null);
  const navigate = useNavigate()

  const token = localStorage.getItem("token");
  const loggedUser = localStorage.getItem("user");

  React.useEffect(() => {;
    if (token) {
      setAuth(true);
    }
    if(loggedUser){
      const userFirstName = JSON.parse(loggedUser).firstName
      setUser(String(userFirstName))
    }
  }, [navigate]);
  

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);  
  };

  const handleClose = () => {
    setAnchorEl(null); 
  };

  const handleLogin = () => {
    navigate("user/login")
  };
  const handleMyEvents = () => {
    if (loggedUser) {
      const role = JSON.parse(loggedUser).role;
      const roleToRoute: Record<string | number, string> = {
        superAdmin: "super-admin/dashboard",
        0: "admin/dashboard",
        1: "staff/dashboard",
      };
  
  
      navigate(roleToRoute[role] || "user/dashboard");
    } else {
   
      navigate("user/dashboard");
    }
  };
  

  const handleLogout = () => {

    localStorage.removeItem("token"); 
    localStorage.removeItem("user"); 
    localStorage.removeItem("sessionId");
    localStorage.removeItem("role"); 
    localStorage.removeItem("preferences"); 
    localStorage.clear()
    setAuth(false);
    setUser(null); 
    setAnchorEl(null);
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT"; 
    
    navigate("/"); 
  };
  
  

  return (
    <Box sx={{ width: '100%', margin: 0, pb: 3 }}>
      <AppBar position="static" sx={{ width: '100%', margin: 0, padding: 0, bgcolor:"#333" }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 2, paddingRight: 2 }}>
        
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, fontFamily: 'apple chancery, cursive' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
              Eventify
            </Link>
          </Typography>

     
          {auth ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
                <div style={{ textDecoration: 'none', color: 'white', fontSize: "60%", paddingLeft: 5, }}>
                {user}
                </div>
            
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}  
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}  
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleMyEvents}>Dashboard</MenuItem>
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button
              variant="contained"
              size="medium"
              onClick={handleLogin}
              sx={{
                backgroundColor: 'inherit',
                color: 'inherit',
                '&:hover': {
                  backgroundColor: '#3f3c3c76',
                },
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
