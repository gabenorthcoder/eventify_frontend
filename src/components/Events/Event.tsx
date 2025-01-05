import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiService from "../../services/apiService";
import Error from "../Error";
import Loader from "../Loader";
import { CardProps } from "../Card";
import { format } from "date-fns";
import ShareOverlay from "../ShareOverlay";
import ShareIcon from "@mui/icons-material/Share";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { SignedUpEvents } from "../User/UserDashboard";

const Event: React.FC = () => {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [event, setEvent] = useState<CardProps | null>(null);
  const [error, setError] = useState<string>("");
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  // @ts-ignore
  const [signedUpEvents, setSignedUpEvents] = useState<SignedUpEvents[]>([]);
  const [isEventInEvents, setIsEventInEvents] = useState<boolean>(false);

  const navigate = useNavigate();

  const [openLoginModal, setOpenLoginModal] = useState(false); 

  const handleCancel = () => {
    setOverlayVisible(false);
  };

 
  const { id } = useParams<{ id: string }>();

  useEffect(() => {

    if (!id) {
      setError("Invalid event ID");
      setIsLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        const response = await apiService.getEvent(Number(id));
        setEvent(response);

        const token = localStorage.getItem("token");
        if (token) {
          const signedUpEventsData = await apiService.getSignedUpEvents(token);
          setSignedUpEvents(signedUpEventsData);

       
          if (response && response.uuid) {
            const eventInEvents = signedUpEventsData.some(
              (e: SignedUpEvents) => e.event.uuid === response.uuid
            );
            setIsEventInEvents(eventInEvents);
          }
        }
      } catch (err) {
        setError((err as Error).message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleGoogleMap = (address: string) => {
    const query = encodeURIComponent(address);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  const handleRegisterEvent = async (eventId: number) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await apiService.signUpForEvent(eventId, token, true);
        const signedUpEventsData = await apiService.getSignedUpEvents(token);
        setSignedUpEvents(signedUpEventsData);
      } catch (e: unknown) {
        const errorMessage = (e as Error).message || String(e);
        setError(`Failed to sign up for event: ${errorMessage}`);
      }

      navigate("/user/dashboard"); 
    } else {
      setOpenLoginModal(true); 
    }
  };

  const handleAddToCalender = async (eventId: number) => {
    const { protocol, hostname, port } = window.location;
  const portPart = port ? `:${port}` : "";
  const redirectUri =  `${protocol}//${hostname}${portPart}`;

    try {
      await apiService.googleCalendar(eventId, redirectUri);
    } catch (e: unknown) {
      const errorMessage = (e as Error).message || String(e);
      setError(`Failed to add event to google calender: ${errorMessage}`);
    }
  };

 
  if (isLoading) {
    return <Loader />;
  }


  if (error) {
    return <Error error={error} />;
  }

  const handleCloseModal = () => {
    setOpenLoginModal(false);
  };


  return (
    <section
      style={{
        textAlign: "center",
        margin: "1% 5% 1% 5%",
        paddingBottom: "80px",
      }}
    >
      {event && (
        <>
          <div>
            <h2 className="title">{event.title}</h2>
          </div>

          <div className="single-image">
            <img src={event.imageUrl} alt={event.title} />
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

          <article className="event-content">
            <div>
              <p className="article-description">{event.description}</p>
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
                className="event-details"
                onClick={() => handleGoogleMap(event.address)}
                style={{ cursor: "pointer" }}
              >
                <span>
                  <b> Address:</b> <small>{event.address}</small>
                </span>
              </div>

              <div className="event-date">
                <b> Date: </b>
                <small>
                  {format(new Date(event.date), "EEE, d MMM, h:mm a")}
                </small>
              </div>
            </div>

            {!isEventInEvents && (
              <div className="button-register">
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => handleRegisterEvent(Number(id))} 
                  sx={{
                    backgroundColor: "#333",
                    color: "white",
                    "&:hover": { backgroundColor: "#3f3c3c76" },
                  }}
                >
                  Register Event
                </Button>
              </div>
            )}

            {isEventInEvents && (
              <>
                <div className="button-register">
                  <h2 className="title">
                    You Already Registered for this event
                  </h2>
                </div>
                <div className="button-register">
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
              </>
            )}
          </article>
        </>
      )}

    
      <Modal
        open={openLoginModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-login-title"
        aria-describedby="modal-login-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 4,
            borderRadius: 2,
            boxShadow: 24,
            textAlign: "center",
            width: 300,
          }}
        >
          <h2 id="modal-login-title">You are not logged in</h2>
          <p id="modal-login-description">
            You need to log in to register for this event. Click below to log
            in.
          </p>
          <Button
            variant="contained"
            onClick={() => {
              navigate(`/user/login`);
              handleCloseModal();
            }}
            sx={{ marginTop: 2, backgroundColor: "#333" }}
          >
            Go to Login
          </Button>
        </Box>
      </Modal>
    </section>
  );
};

export default Event;
