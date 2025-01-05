import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function GoogleCalendarCallback() {
  const navigate = useNavigate();
  const hasRun = useRef(false); 

  useEffect(() => {
    if (hasRun.current) return; 
    hasRun.current = true; 

    const query = new URLSearchParams(window.location.search);
    const eventData = query.get("event");

    let parsedEvent = null;
    try {
      parsedEvent = eventData ? JSON.parse(decodeURIComponent(eventData)) : null;
    } catch (error) {
      console.error("Error parsing event data:", error);
    }

    if (parsedEvent) {
      alert(`Event "${parsedEvent.summary}" has been successfully added to your Google Calendar!`);
      window.open(parsedEvent.htmlLink, "_blank", "width=800,height=600");
      setTimeout(() => {
        navigate("/user/dashboard");
      }, 100);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <div>Processing Google Calendar event...</div>;
}

export default GoogleCalendarCallback;
