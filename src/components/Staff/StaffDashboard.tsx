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
  Avatar,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import apiService from "../../services/apiService";
import SmallLoader from "../SmallLoader";
import Error from "../Error";


const StaffDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [viewUsers, setViewUsers] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token") || "";
  const pageSource = location.state?.from;

  useEffect(() => {
    if (pageSource === 'userRegistration') {
      setViewUsers(true);
    }
  }, [pageSource]);

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
        const eventsData = await apiService.getEvents(token);
        setEvents(eventsData);
        const usersData = await apiService.listUsers(token);
        setUsers(usersData);
        setIsLoading(false);
        setError("");
      } catch (e: unknown) {
        const errorMessage = (e as Error).message || String(e);
        setError(`Failed to fetch data: ${errorMessage}`);
        retryFetch()
      }
    };
    fetchData();
  }, [successMessage,retry]);

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
    console.log(`Edit ${viewUsers ? 'user' : 'event'} with id: ${id}`);
  };

  const handleDelete = async (id: number) => {
    const actionCaller = viewUsers ? 'user' : 'event';

    try {
      if (actionCaller === 'user') {
        const deleteUserResponse = await apiService.deleteUser(token, id);
        setSuccessMessage(deleteUserResponse.message);
      } else if (actionCaller === 'event') {
        const deleteEventResponse = await apiService.deleteEvent(token, id);
        setSuccessMessage(deleteEventResponse.message);
      }
    } catch (error) {
      const errorMessage = (error as Error).message || String(error);
      setError(`Failed to delete ${actionCaller}: ${errorMessage}`);
    }
  };

  const handleCreateEvent = () => {
    navigate("/events/create",  { state: { from: "staff" } });
  };

  const handleRegisterStaffOrUser = () => {
    navigate("/staff/register");
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

        <Typography variant="h5">Staff Dashboard</Typography>

        <Button
          variant="contained"
          sx={{ margin: "1%", backgroundColor: "#333", mb: 2, color: "white" }}
          onClick={handleCreateEvent}
        >
          Create Event
        </Button>
        <Button
          variant="contained"
          sx={{ margin: "1%", backgroundColor: "#333", mb: 2, color: "white" }}
          onClick={handleRegisterStaffOrUser}
        >
          Register User
        </Button>

        <Button
          variant="contained"
          sx={{ margin: "1%", backgroundColor: "#333", mb: 2, color: "white" }}
          onClick={() => setViewUsers(!viewUsers)}
        >
          {viewUsers ? "View Events" : "View Users"}
        </Button>

        {isLoading ? (
          <SmallLoader />
        ) : (
          <>
            <Typography variant="h6">{`Manage ${viewUsers ? "Users" : "Events"}`}</Typography>
            <TableContainer component={Paper} sx={{ overflowX: "auto", width: "100%" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {viewUsers ? (
                      <>
                        <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>First Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Last Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Created By</TableCell>
                        <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Created At</TableCell>
                        <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Updated By</TableCell>
                        <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Updated At</TableCell>
                        <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Actions</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Title</TableCell>
                        <TableCell sx={{ fontWeight: "bold", minWidth: "350px" }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Address</TableCell>
                        <TableCell sx={{ fontWeight: "bold", minWidth: "50px" }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: "bold", minWidth: "10px" }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: "bold", minWidth: "150px" }}>Created By</TableCell>
                        <TableCell sx={{ fontWeight: "bold", minWidth: "50px" }}>Created</TableCell>
                        <TableCell sx={{ fontWeight: "bold", minWidth: "50px" }}>Updated</TableCell>
                        <TableCell sx={{ fontWeight: "bold", minWidth: "50px" }}>Actions</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {viewUsers
                    ? users.length === 0
                      ? <TableRow><TableCell colSpan={4}><Typography>No users available.</Typography></TableCell></TableRow>
                      : users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.firstName}</TableCell>
                            <TableCell>{user.lastName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{getRoleName(user.role)}</TableCell>
                            <TableCell>{user.createdBy?.firstName} {user.createdBy?.lastName} ({getRoleName(user.createdBy?.role)})</TableCell>
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
                        ))
                    : events.length === 0
                    ? <TableRow><TableCell colSpan={9}><Typography>No events available.</Typography></TableCell></TableRow>
                    : events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>{event.title}</TableCell>
                          <TableCell>{event.description}</TableCell>
                          <TableCell>{event.address}</TableCell>
                          <TableCell>{new Date(event.date).toLocaleString()}</TableCell>
                          <TableCell>
                            <Avatar
                              sx={{
                                bgcolor: event.isActive ? "green" : "red",
                                width: 10,
                                height: 10,
                                display: "inline-block",
                                verticalAlign: "middle",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            {`${event.createdBy.firstName} ${event.createdBy.lastName} (${getRoleName(event.createdBy.role)})`}
                          </TableCell>
                          <TableCell>{new Date(event.createdAt).toLocaleString()}</TableCell>
                          <TableCell>{new Date(event.updatedAt).toLocaleString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{ whiteSpace: "nowrap", backgroundColor: "#333", mb: 2, color: "white" }}
                              onClick={() => handleEdit(event.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{ whiteSpace: "nowrap", backgroundColor: "#333", mb: 2, color: "white" }}
                              onClick={() => handleDelete(event.id)}
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

export default StaffDashboard;
