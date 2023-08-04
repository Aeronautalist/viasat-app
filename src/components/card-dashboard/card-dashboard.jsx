import "./card-dashboard.css";
import LaunchCard from "../launch-card/launch-card";

const CardDashboard = ({ data = [] }) => {
  return (
    <>
      <div className="dashboard">
        {data.map((launchData) => (
          <LaunchCard
            key={launchData.id}
            rocketTitle={launchData.name}
            details={launchData.details}
            fNumber={launchData.flight_number}
            date={launchData.date_utc}
            image={
              launchData.links?.flickr?.original[0] ||
              launchData.links?.patch?.small ||
              "src/assets/defaultLaunch.jpg"
            }
          />
        ))}
      </div>
    </>
  );
};

export default CardDashboard;
