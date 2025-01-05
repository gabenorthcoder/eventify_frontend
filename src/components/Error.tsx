import React from "react";

interface ErrorProps {
  error: string;
}

const Error: React.FC<ErrorProps> = ({ error }) => {
  return (
    <>
       <section className="overlay" id="overlay-content">
       <h1>There has been an Error</h1>
       <p>{error}</p>
       </section>
    
    </>
  );
};

export default Error;
