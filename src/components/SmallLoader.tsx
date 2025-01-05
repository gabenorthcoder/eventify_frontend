import React from "react";
import MoonLoader from "react-spinners/MoonLoader";

const SmallLoader: React.FC = () => {
  return (

    <div className="small-loader" id="overlay-content" style={{ display: "block", margin: "0 auto" }}>
      <MoonLoader size={100} color="#333" />
    </div>
  );
};

export default SmallLoader;
