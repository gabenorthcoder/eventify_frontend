
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode"

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: any[]; 
  superAdminRole?: string
}


interface JwtPayload {
  id: number;
  role: number; 
  exp: number; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  superAdminRole
}) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const pathParts = location.pathname.split("/");

  if (!token) {

    if(pathParts[1] === "events"){
      return <Navigate to={`/staff/login`} state={{ from: location }} replace />;
    }
    return <Navigate to={`/${pathParts[1]}/login`} state={{ from: location }} replace />;
  }

  try {

    const decodedToken = jwtDecode<JwtPayload>(token);

    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to={`/${pathParts[1]}/login`} state={{ from: location }} replace />;
    }


    if(allowedRoles){
      if (!allowedRoles.includes(decodedToken.role)) {
        return <Navigate to="/error" replace />;
      }
    }

    if(superAdminRole){
      if (superAdminRole !== "superAdmin") {
        return <Navigate to="/error" replace />;
      }
    }
    return children;
  } catch (error) {

    console.error("Invalid token", error);
    localStorage.removeItem("token");
    return <Navigate to={`/${pathParts[1]}/login`} state={{ from: location }} replace />;
  }
};

export default ProtectedRoute;
