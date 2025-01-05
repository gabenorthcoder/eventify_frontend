import * as React from "react";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import Error from "./Error";
import apiService from "../services/apiService";
import Card from "./Card";
import { CardProps } from "./Card";
import { Box, Button } from "@mui/material";

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<CardProps[]>([]);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const limit = 6;
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
        const response = await apiService.getEvents(
          undefined,
          String(page),
          String(limit)
        );

        setEvents(response.data as CardProps[]);
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

  if (isLoading) {
    return <Loader />;
  }
  if (error && !isLoading) {
    return <Error error={error} />;
  }

  return (
    <Box sx={{ padding: "0", margin: "0" }}>
      <h1 className="title">Available Events</h1>
      <section className="events-grid">
        {events.map((event) => {
          return (
            <div key={event.uuid}>
              <Card
                id={event.id}
                title={event.title}
                description={event.description}
                address={event.address}
                imageUrl={event.imageUrl}
                date={event.date}
                pageLocation={"home"}
              />
            </div>
          );
        })}
      </section>
      <section
        style={{
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          margin: "1% 16% 1% 16%",
          paddingBottom: "5%",
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
          {" "}
     
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

export default Home;
