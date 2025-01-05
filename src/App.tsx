import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateEvent from "./components/Events/CreatEvent";
import RegisterAdmin from "./components/Admin/RegisterAdmin";
import UpdateAdmin from "./components/Admin/UpdateAdmin";
import SuperAdminDashboard from "./components/SuperAdmin/SuperAdminDashboard";
import SuperAdminLogin from "./components/SuperAdmin/SuperAdminLogin";
import UserDashboard from "./components/User/UserDashboard";
import Layout from "./components/Layout";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import StaffDashboard from "./components/Staff/StaffDashboard";
import GoogleCallback from "./components/Auth/GoogleCallback";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import GoogleCalendarCallback from "./components/Auth/GoogleCalendarCallback";
import Home from "./components/Home";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import Error from "./components/Error";
import Event from "./components/Events/Event";
import StaffLogin from "./components/Staff/StaffLogin";
import RegisterSuperAdmin from "./components/SuperAdmin/SuperAdminRegister";
import RegisterStaff from "./components/Staff/RegisterStaff";
import Terms from "./components/Terms";
import Privacy from "./components/Privacy";

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/super-admin/login" element={<SuperAdminLogin />} />
          <Route path="/super-admin/dashboard" element={<ProtectedRoute superAdminRole={"superAdmin"}> <SuperAdminDashboard /> </ProtectedRoute>} />
          <Route path="/super-admin/register" element={<ProtectedRoute superAdminRole={"superAdmin"}> <RegisterSuperAdmin /> </ProtectedRoute>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={ <ProtectedRoute allowedRoles={[0]}> <AdminDashboard /> </ProtectedRoute> } />
          <Route path="/admin/register" element={<ProtectedRoute allowedRoles={[0]}> <RegisterAdmin /> </ProtectedRoute>} />
          <Route path="/admin/:id/update" element={<ProtectedRoute allowedRoles={[0]}> <UpdateAdmin /> </ProtectedRoute>} />
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/staff/dashboard" element={ <ProtectedRoute allowedRoles={[1]}> <StaffDashboard /> </ProtectedRoute> } />
          <Route path="/staff/register" element={ <ProtectedRoute allowedRoles={[1]}> <RegisterStaff/> </ProtectedRoute> } />
          <Route path="/events/create" element={<ProtectedRoute allowedRoles={[0,1]}> <CreateEvent /> </ProtectedRoute>} />
          <Route path="/user/login" element={<SignIn />} />
          <Route path="/user/sign-up" element={<SignUp />} />
          <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={[2]}> <UserDashboard /> </ProtectedRoute>} />
          <Route path="/event/:id" element={<Event />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          <Route path="/auth/google/calender/callback" element={<GoogleCalendarCallback />} />
          <Route path="/privacy" element={<Privacy/>} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/error" element={<Error error={"Please login and try again"} />} />
          <Route path="*" element={<Error error={"Page Not Found"} />} />
          
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
