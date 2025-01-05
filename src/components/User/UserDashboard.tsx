import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import apiService from "../../services/apiService";
import Card from "../Card";
import UserCard from "./UserCard";
import { Button } from "@mui/material";
import { CardProps } from "../Card";
import Loader from "../Loader";
import Error from "../Error";

interface Event {
  id: number;
  uuid: string;
  title: string;
  description: string;
  address: string;
  date: string;
  imageUrl: string;
}

export interface SignedUpEvents {
  id: number;
  event: Event;
}

const UserDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<CardProps[]>([]);
  const [signedUpEvents, setSignedUpEvents] = useState<SignedUpEvents[]>([]);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 6;
  const token = localStorage.getItem("token") || "";

  const retryFetch = () => {
    if (retry < 5) {
      setTimeout(() => setRetry((prev) => prev + 1), 3000);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const signedUpEventsData = await apiService.getSignedUpEvents(token);

        setSignedUpEvents(signedUpEventsData);

        const response = await apiService.getEvents(
          undefined,
          String(page),
          String(limit)
        );

        const filteredEvents = (response.data || []).filter(
          (event: CardProps) =>
            !(signedUpEventsData || []).some(
              (signedUpEvent: SignedUpEvents) =>
                signedUpEvent.event?.id === event.id
            )
        );

        setEvents(filteredEvents); 

  

        setTotalPages(Math.ceil(response.total / limit));
        setIsLoading(false);
        setError(""); 
      } catch (e) {
        const errorMessage = (e as Error).message || String(e);
        setError(`Failed to fetch events: ${errorMessage}`);
        retryFetch(); 
      }
    };

    if (retry < 5) fetchEvents(); 
    else setIsLoading(false); 
  }, [retry, page, limit]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleSignUp = async (eventId: number) => {
    const token = localStorage.getItem("token") || "";
    try {
      await apiService.signUpForEvent(eventId, token, true);
      const signedUpEventsData = await apiService.getSignedUpEvents(token);

      setSignedUpEvents(signedUpEventsData);
    } catch (e: unknown) {
      const errorMessage = (e as Error).message || String(e);
      setError(`Failed to sign up for event: ${errorMessage}`);
    }
  };

  const handleCancelSignUp = async (eventId: number) => {
    const token = localStorage.getItem("token") || "";
    try {
      await apiService.signUpForEvent(eventId, token, false);
      const signedUpEventsData = await apiService.getSignedUpEvents(token);
      setSignedUpEvents(signedUpEventsData);
    } catch (e: unknown) {
      const errorMessage = (e as Error).message || String(e);
      setError(`Failed to cancel event signup: ${errorMessage}`);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error && !isLoading) {
    return <Error error={error} />;
  }

  return (
    <Box sx={{ padding: "0", margin: "0" }}>
    
      <section style={{ textAlign: "center", margin: "1% 5% 1% 5%" }}>
        <h1 className="title">Attending</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center", 
          }}
        >
          <div
            style={{
              display: "flex",
              overflowX: "auto", 
              scrollSnapType: "x mandatory", 
              gap: "15px", 
              paddingBottom: "10px",
              whiteSpace: "nowrap", 
            }}
          >
            {signedUpEvents && signedUpEvents.length > 0 ? (
              signedUpEvents.map((signedUpEvent) => (
                <div key={signedUpEvent.id} style={{ marginRight: "15px" }}>
                  <UserCard
                    id={signedUpEvent.event.id}
                    uuid={signedUpEvent.event.uuid}
                    title={signedUpEvent.event.title}
                    description={signedUpEvent.event.description}
                    address={signedUpEvent.event.address}
                    imageUrl={signedUpEvent.event.imageUrl}
                    date={signedUpEvent.event.date}
                    onCancel={() => handleCancelSignUp(signedUpEvent.event.id)}
                  />
                </div>
              ))
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "30px",
                  width: "100%",
                }}
              >
                <p>No signed-up events yet</p>
              </div>
            )}
          </div>
        </div>
      </section>

    
      <section style={{ textAlign: "center", margin: "1% 5% 1% 5%" }}>
        <h1 className="title">All Events</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center", 
          }}
        >
          <div
            style={{
              display: "flex",
              overflowX: "auto", 
              scrollSnapType: "x mandatory", 
              gap: "15px", 
              paddingBottom: "10px",
              whiteSpace: "nowrap", 
            }}
          >
            {events && events.length > 0 ? (
              events.map((event) => (
                <div key={event.uuid} style={{ marginRight: "15px" }}>
                  <Card
                    id={event.id}
                    title={event.title}
                    description={event.description}
                    address={event.address}
                    imageUrl={event.imageUrl}
                    date={event.date}
                    onSignUp={() => handleSignUp(event.id)}
                  />
                </div>
              ))
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "30px",
                  width: "100%",
                }}
              >
                <p>No events available</p>
              </div>
            )}
          </div>
        </div>
      </section>

 
      <section
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "1% 5% 1% 5%",
          paddingBottom: "7%",
        }}
      >

        <Button
          variant="contained"
          size="medium"
          onClick={handlePrevPage}
          disabled={page === 1}
          sx={{
            backgroundColor: "#333",
            color: "white",
            "&:hover": {
              backgroundColor: "#3f3c3c76",
            },
          }}
        >
          Previous
        </Button>


        <div style={{ textAlign: "center" }}>
          <h4>
            Page {page} of {totalPages}
          </h4>
        </div>

       
        <Button
          variant="contained"
          size="medium"
          onClick={handleNextPage}
          disabled={page === totalPages}
          sx={{
            backgroundColor: "#333",
            color: "white",
            "&:hover": {
              backgroundColor: "#3f3c3c76",
            },
          }}
        >
          Next
        </Button>
      </section>
    </Box>
  );
};

export default UserDashboard;
