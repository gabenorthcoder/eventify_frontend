import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/apiService";
import SmallLoader from "../SmallLoader";
import Error from "../Error";

const SuperAdminDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token") || "";

  React.useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (token && loggedUser) {
      const userRole = String(JSON.parse(loggedUser).role)
      if (userRole !== 'superAdmin'){
        localStorage.clear()
        navigate("/super-admin/login");
      }
    } 
  }, [navigate]);


  const retryFetch = () => {
    if (retry < 5) {
      setTimeout(() => setRetry(prev => prev + 1), 3000);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await apiService.getAllUsers(token);
        setUsers(usersData);
        setIsLoading(false);
        setError("");
      } catch (e: unknown) {
        const errorMessage = (e as Error).message || String(e);
        setError(`Failed to fetch data: ${errorMessage}`);
        retryFetch();
      }
    };
    fetchData();
  }, [successMessage, retry]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000); 

      return () => clearTimeout(timer); 
    }
  }, [successMessage]);

  const getRoleName = (role: number) => {
    switch (role) {
      case 0:
        return "Admin";
      case 1:
        return "Staff";
      case 2:
        return "User";
      default:
        return "Guest";
    }
  };

  const handleEdit = (id: number) => {
    console.log(`Edit user with id: ${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      const deleteUserResponse = await apiService.superAdminDelete(token, id);
      setSuccessMessage(deleteUserResponse.message);
    } catch (error) {
      const errorMessage = (error as Error).message || String(error);
      setError(`Failed to delete user: ${errorMessage}`);
    }
  };

  const handleRegisterStaffOrUser = () => {
    navigate("/super-admin/register");
  };

  if (error && retry >= 5) {
    return <Error error={error} />;
  }

  return (
    <>
      <Box sx={{ padding: "0", margin: "1% 5% 10% 5%", textAlign: "center" }}>
    
        {successMessage && (
          <Alert 
            severity="success" 
            onClose={() => setSuccessMessage(null)} 
            sx={{ display: 'flex', justifyContent: 'space-between' }}
          >
            {successMessage}
          </Alert>
        )}

        {error && (
          <Alert severity="error">{error}</Alert>
        )}

        <Typography variant="h5">Super Admin Dashboard</Typography>

        <Button
          variant="contained"
          sx={{ margin: "1%", backgroundColor: "#333", mb: 2, color: "white" }}
          onClick={handleRegisterStaffOrUser}
        >
          Register User
        </Button>

        <Typography variant="h6">Manage Users</Typography>
        
        {isLoading ? (
          <SmallLoader />
        ) : (
          <>
            <TableContainer component={Paper} sx={{ overflowX: "auto", width: "100%" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>First Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Last Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold", minWidth: "100px" }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Created At</TableCell>
                    <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Updated By</TableCell>
                    <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Updated At</TableCell>
                    <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.length === 0
                    ? <TableRow><TableCell colSpan={9}><Typography>No users available.</Typography></TableCell></TableRow>
                    : users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.firstName}</TableCell>
                          <TableCell>{user.lastName}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleName(user.role)}</TableCell>
                          <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                          <TableCell>{user.updatedBy?.firstName} {user.updatedBy?.lastName} ({getRoleName(user.updatedBy?.role)})</TableCell>
                          <TableCell>{new Date(user.updatedAt).toLocaleString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{ whiteSpace: "nowrap", backgroundColor: "#333", mb: 2, color: "white" }}
                              onClick={() => handleEdit(user.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{ whiteSpace: "nowrap", backgroundColor: "#333", mb: 2, color: "white" }}
                              onClick={() => handleDelete(user.id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </>
  );
};

export default SuperAdminDashboard;
