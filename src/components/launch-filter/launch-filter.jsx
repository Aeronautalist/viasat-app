import "./launch-filter.css";
import { useRef, useState } from "react";
import {
  SlCheckbox,
  SlDropdown,
  SlMenu,
  SlRadioGroup,
  SlRadio,
  SlButton,
} from "@shoelace-style/shoelace/dist/react";

const LaunchFilter = ({ applyFilters }) => {
  const ref = useRef(null);
  const [order, setOrder] = useState("asc");

  /**
   * Called when Apply button is clicked.
   * Gets values from each checkbox and order state and fires callback function.
   */
  const handleClick = () => {
    const menu = ref.current;
    const selected = menu.querySelectorAll("sl-checkbox[checked]");
    const values = {};
    selected.forEach((checkbox) => {
      values[checkbox.value] = true;
    });
    const detail = {
      values,
      order,
    };

    applyFilters(detail);
  };

  /**
   * Sets order from radio buttons.
   */
  const handleRadioClick = (event) => {
    setOrder(event.target.value);
  };

  return (
    <>
      <SlDropdown role="listbox" skidding={100} placement="bottom-end">
        <div className="filter-title" slot="trigger">
          Filters
        </div>
        <SlMenu ref={ref} className="sl-menu">
          <div className="menu-option">
            <SlCheckbox role="checkbox" value="upcoming">
              Upcoming Launches
            </SlCheckbox>
            <SlCheckbox role="checkbox" value="past">
              Past Launches
            </SlCheckbox>
            <SlCheckbox role="checkbox" value="failed">
              Unsuccessful Launches
            </SlCheckbox>
          </div>
          <p className="menu-title">Order</p>
          <div className="menu-option">
            <SlRadioGroup value={order} onSlInput={handleRadioClick}>
              <SlRadio value="asc">Ascending</SlRadio>
              <SlRadio value="dsc">Descending</SlRadio>
            </SlRadioGroup>
          </div>
          <div className="menu-option">
            <SlButton className="apply-button" onClick={handleClick}>
              Apply
            </SlButton>
          </div>
        </SlMenu>
      </SlDropdown>
    </>
  );
};

export default LaunchFilter;
