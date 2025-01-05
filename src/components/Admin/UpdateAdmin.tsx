import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useParams } from "react-router-dom";
import apiService from "../../services/apiService";

const UpdateAdmin: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const adminId = id ? parseInt(id, 10) : 0;
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || "";
    try {
      if (adminId) {
        await apiService.updateAdmin(adminId, { email, firstName, lastName }, token);

      } else {
        setError("Invalid admin ID");
      }
    } catch (err) {
      setError("Admin update failed");
    }
  };

  return (
    <Box>
      <Typography variant="h4">Update Admin</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleUpdateAdmin}>
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        <Button type="submit">Update Admin</Button>
      </form>
    </Box>
  );
};

export default UpdateAdmin;
