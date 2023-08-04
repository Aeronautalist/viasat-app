import "./viasat-loader.css";
import { SlSpinner } from "@shoelace-style/shoelace/dist/react";

const ViasatLoader = ({ show }) => {
  return (
    <>
      <div className="loader">
        <SlSpinner style={{ fontSize: "3rem" }} />
      </div>
    </>
  );
};

export default ViasatLoader;
