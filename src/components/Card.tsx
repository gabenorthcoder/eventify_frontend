import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InfoIcon from '@mui/icons-material/Info';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import EventAvailableOutlined from '@mui/icons-material/EventAvailableOutlined';
import ShareIcon from "@mui/icons-material/Share";
import { format } from 'date-fns';
import ShareOverlay from "./ShareOverlay";
import Button from "@mui/material/Button";

export interface CardProps {
  uuid?: string;
  id: number;
  title: string;
  description: string;
  address: string;
  imageUrl: string;
  date: Date;
  onSignUp?: () => void;
  pageLocation?:string;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  description,
  address,
  imageUrl,
  date,
  onSignUp,
  pageLocation
}) => {
  const navigate = useNavigate();
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const handleCancel = () => {
    setOverlayVisible(false);
  };

  const truncateText = (text: string) => {
    const words = text.split(' ');
    if (words.length <= 5) return text;
    return words.slice(0, 5).join(' ') + '...';
  };

  const truncateAddress = (text: string) => {
    const words = text.split(",");
    if (words.length <= 1) return text;
    return words.slice(0, 1).join(',');
  };

  const handleClick = () => {
    navigate(`/event/${id}`);
  };


  const handleGoogleMap = (address: string) => {
    const query = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <section className="event">
      <div className="event-image">
        <img src={imageUrl} alt={title} onClick={handleClick} />
        <button className="share-button" onClick={() => setOverlayVisible(true)}>
          <ShareIcon className="share-icon" fontSize="large" />
        </button>
        {isOverlayVisible && (
          <ShareOverlay url={`${window.location.href}event/${id}`} onCancel={handleCancel} />
        )}
      </div>
      <div className="event-content">
        <div className="event-title" onClick={handleClick} style={{ cursor: 'pointer' }}>
          <h4>{title}</h4>
        </div>
        <div className="event-details">
          <EventAvailableOutlined className="event-icon" />
          <small className="event-date">
            <b>{format(new Date(date), "EEE, d MMM, h:mm a")}</b>
          </small>
        </div>
        <div
          className="event-details"
          onClick={() => handleGoogleMap(address)}
          style={{ cursor: 'pointer' }}
        >
          <PlaceOutlined className="event-icon" />
          <span>
            <small>{truncateAddress(address)}</small>
          </span>
        </div>
        <div className="event-details">
          <InfoIcon className="event-icon" />
          <span onClick={handleClick} style={{ cursor: 'pointer' }}>{truncateText(description)}</span>
        </div>
        {pageLocation !== "home" && <div className="button-container">
          <Button
            variant="contained"
            size="medium"
            onClick={onSignUp}
            sx={{
            
              backgroundColor: '#333',
              color: 'white',
              '&:hover': { backgroundColor: '#3f3c3c76' },
            }}
          >
            Sign Up
          </Button>
        </div>}
        

      </div>
    </section>
  );
};

export default Card;
