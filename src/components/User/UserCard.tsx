import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import EventAvailableOutlined from "@mui/icons-material/EventAvailableOutlined";
import ShareIcon from "@mui/icons-material/Share";
import { format } from "date-fns";
import ShareOverlay from "../ShareOverlay";
import Button from "@mui/material/Button";
import apiService from "../../services/apiService";

export interface UserCardProps {
  id: number;
  uuid: string;
  title: string;
  description: string;
  address: string;
  date: string;
  imageUrl: string;
  onCancel?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
  id,
  title,
  description,
  address,
  imageUrl,
  date,
  onCancel,
}) => {
  const navigate = useNavigate();
  const [isOverlayVisible, setOverlayVisible] = useState(false);




  const formattedDate =
    new Date(date) instanceof Date && !isNaN(new Date(date).getTime())
      ? format(new Date(date), "EEE, d MMM, h:mm a")
      : "Invalid date"; 


  const handleNavigate = (path: string) => navigate(path);

  const handleGoogleMap = (address: string) => {
    const query = encodeURIComponent(address);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  const handleCancel = () => setOverlayVisible(false);
  
  const handleAddToCalender = async (eventId: number) => {
    const { protocol, hostname, port } = window.location;
  const portPart = port ? `:${port}` : "";
  const redirectUri =  `${protocol}//${hostname}${portPart}`;

    try {
      await apiService.googleCalendar(eventId, redirectUri);
    } catch (error) {
      console.error("Error adding to calendar:", error);
    }
  };

  const truncateText = (text: string, wordLimit = 5) => {
    const words = text.split(" ");
    return words.length <= wordLimit
      ? text
      : words.slice(0, wordLimit).join(" ") + "...";
  };

  const truncateAddress = (text: string | undefined) => {
    if (!text) return "No address provided";
    const parts = text.split(",");
    return parts.length > 1 ? parts[0] : text;
  };

  return (
    <section className="event">
  
      <div className="event-image">
        <img
          src={imageUrl}
          alt={title}
          onClick={() => handleNavigate(`/event/${id}`)}
          style={{ cursor: "pointer" }}
        />
        <button
          className="share-button"
          onClick={() => setOverlayVisible(true)}
        >
          <ShareIcon className="share-icon" fontSize="large" />
        </button>
        {isOverlayVisible && (
          <ShareOverlay
            url={`${window.location.href}event/${id}`}
            onCancel={handleCancel}
          />
        )}
      </div>

      <div className="event-content">
        <div
          className="event-title"
          onClick={() => handleNavigate(`/event/${id}`)}
          style={{ cursor: "pointer" }}
        >
          <h4>{title}</h4>
        </div>

        <div className="event-details">
          <EventAvailableOutlined className="event-icon" />
          <small className="event-date">
            <b>{formattedDate}</b>
          </small>
        </div>

        <div
          className="event-details"
          onClick={() => handleGoogleMap(address)}
          style={{ cursor: "pointer" }}
        >
          <PlaceOutlined className="event-icon" />
          <span>
            <small>{truncateAddress(address)}</small>
          </span>
        </div>

        <div className="event-details">
          <InfoIcon className="event-icon" />
          <span
            onClick={() => handleNavigate(`/event/${id}`)}
            style={{ cursor: "pointer" }}
          >
            {truncateText(description)}
          </span>
        </div>

    
        <div
          className="button-container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            className="button-cancel"
            style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}
          >
<Button
            variant="contained"
            size="small"
            onClick={onCancel}
            sx={{
            
              backgroundColor: '#333',
              color: 'white',
              '&:hover': { backgroundColor: '#3f3c3c76' },
            }}
          >
            Cancel
          </Button>
            
     
          </div>

          <div
            className="button-calender"
            style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
          >
             <Button
                    variant="contained"
                    size="medium"
                    onClick={() => handleAddToCalender(Number(id))} 
                    sx={{
                      backgroundColor: "#333",
                      color: "white",
                      "&:hover": { backgroundColor: "#3f3c3c76" },
                    }}
                  >
                    Add to Google Calendar
                  </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserCard;
