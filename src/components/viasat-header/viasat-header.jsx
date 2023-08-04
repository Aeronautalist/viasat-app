import "./viasat-header.css";

const ViasatHeader = ({ left, right }) => {
  return (
    <>
      <div className="viasat-header">
        <div className="left">{left}</div>
        <div className="right">{right}</div>
      </div>
    </>
  );
};

export default ViasatHeader;
