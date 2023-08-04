import { useState, useEffect } from "react";
import ViasatHeader from "./components/viasat-header/viasat-header";
import ViasatFooter from "./components/viasat-footer/viasat-footer";
import CardDashboard from "./components/card-dashboard/card-dashboard";
import LaunchFilter from "./components/launch-filter/launch-filter";
import PaginationButtons from "./components/pagination-buttons/pagination-buttons";
import ViasatLoader from "./components/viasat-loader/viasat-loader";

import "./App.css";

const App = () => {
  const [spaceXData, setSpaceXData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showLoading, setShowLoading] = useState(true);
  const [showError, setShowError] = useState(false);

  const CARDS_PER_PAGE = 6;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const startData = page * CARDS_PER_PAGE;
    const endData = startData + CARDS_PER_PAGE;
    const display = updatedData.slice(startData, endData);
    setDisplayData(() => [...display]);
  }, [page, updatedData]);

  useEffect(() => {
    const totalToSet = Math.ceil(updatedData.length / CARDS_PER_PAGE);
    setTotalPages(totalToSet);
  }, [updatedData]);

  /**
   * Fetches data from spaceX Endpoint.
   * Shows error state in case of failure.
   * Hides loader when query is finished.
   */
  const fetchData = async () => {
    try {
      const response = await fetch("https://api.spacexdata.com/v5/launches");
      const allSpacexData = await response.json();
      setSpaceXData(() => [...allSpacexData]);
      setUpdatedData(() => [...allSpacexData]);
      setDisplayData(() => [...allSpacexData.slice(0, CARDS_PER_PAGE)]);
      setTotalPages(allSpacexData.length / (CARDS_PER_PAGE - 1));
    } catch (e) {
      setShowError(true);
    }
    setShowLoading(false);
  };

  /**
   * Filters data based on filters from filter component.
   * @param { Object } filters
   */
  const filterData = (filters) => {
    const { upcoming, past, failed } = filters.values;
    let filteredData = [];
    if (!upcoming && !past && !failed) {
      filteredData = [...spaceXData];
    } else {
      filteredData = spaceXData.filter((data) => {
        if (upcoming && data.upcoming) {
          return data;
        } else if (past && !data.upcoming) {
          return data;
        } else if (failed && data.success === false) {
          return data;
        }
      });
    }
    sortData(filteredData, filters.order);
    setUpdatedData(() => [...filteredData]);
    setPage(() => 0);
  };

  /**
   * Sorts array by given direction.
   * @param { Array } data
   * @param { String } direction
   */
  const sortData = (data, direction) => {
    if (direction === "asc") {
      data = data.sort((a, b) => {
        return a.flight_number - b.flight_number;
      });
    } else {
      data = data.sort((a, b) => {
        return b.flight_number - a.flight_number;
      });
    }
    return data;
  };

  /**
   * Change page on given number.
   * @param { Number } pageNumber
   */
  const changePage = (pageNumber) => {
    setPage(pageNumber);
  };

  /**
   * Show an error state.
   */
  const renderError = () => (
    <div className="error-state">
      Error loading data. please try again later
    </div>
  );

  /**
   * Renders either an error state or the app content.
   */
  const renderApp = () => (
    <>
      {showError ? (
        renderError()
      ) : (
        <div className="app">
          <ViasatHeader
            left={<h1>Launch Data</h1>}
            right={<LaunchFilter applyFilters={filterData} />}
          />
          <CardDashboard data={displayData} />
          <ViasatFooter
            middle={
              <PaginationButtons pages={totalPages} pageClicked={changePage} />
            }
          />
        </div>
      )}
    </>
  );

  return <>{showLoading ? <ViasatLoader /> : renderApp()}</>;
};

export default App;
