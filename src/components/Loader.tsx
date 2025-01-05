import React from "react";
import MoonLoader from "react-spinners/MoonLoader";

const Loader: React.FC = () => {
  return (
    <section className="overlay" id="overlay-content">
      <div id="overlay-content" style={{ display: "block", margin: "0 auto" }}>
        <MoonLoader size={300} color="#333" />
      </div>
    </section>
  );
};

export default Loader;
