import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    const user = query.get("user");

    let parsedUser = null;
    try {
      parsedUser = user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error parsing user:", error);
    }



    if (token && parsedUser) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(parsedUser));

      setTimeout(() => {
        navigate("/user/dashboard");
      }, 100); 
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <div>Processing login...</div>;
}

export default GoogleCallback;
