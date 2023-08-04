import "./launch-card.css";
import { SlFormatDate, SlTag } from "@shoelace-style/shoelace/dist/react";

const LaunchCard = ({
  rocketTitle = "Rocket Title",
  date = "1234567",
  details = "Details about a launch",
  image = "src/assets/defaultLaunch.jpg",
  fNumber = 0,
}) => {
  const noDetails = "No Launch Details Available";
  return (
    <>
      <div className="card" role="card">
        <div className="image-holder">
          <img src={image} alt="Img of sat." />
          {/* <div className="image-text">Flight Number: {fNumber}</div> */}
          <SlTag variant="primary" className="image-text">
            Flight Number: {fNumber}
          </SlTag>
        </div>
        <div className="details-holder">
          <div className="launch-header">
            <span className="launch-title">{rocketTitle}</span>
            <span>
              <SlFormatDate
                className="launch-date"
                date={date}
                month="numeric"
                day="numeric"
                year="numeric"
                hour="2-digit"
                minute="2-digit"
                second="2-digit"
                lang="en-gb"
              />
            </span>
          </div>
          <p className="launch-details">
            {details?.length > 0 ? details : noDetails}
          </p>
        </div>
      </div>
    </>
  );
};

export default LaunchCard;
