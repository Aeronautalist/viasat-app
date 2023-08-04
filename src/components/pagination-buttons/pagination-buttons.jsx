import "./pagination-buttons.css";
import { useState, useEffect, useRef } from "react";
import { SlButton, SlButtonGroup } from "@shoelace-style/shoelace/dist/react";

const PaginationButtons = ({ pages = 0, pageClicked = () => {} }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [buttons, setButtons] = useState([]);
  const prevButton = useRef(null);
  const nextButton = useRef(null);
  const TOTAL_PAGE_T0_SHOW = 3;

  useEffect(() => {
    const buttonsArray = [];
    if (currentPage - 2 > 0) {
      _addElipsButton(buttonsArray, "first");
    }

    const initialPages =
      pages < TOTAL_PAGE_T0_SHOW ? pages : TOTAL_PAGE_T0_SHOW;
    buttonsArray.push([..._createButtons(0, initialPages)]);

    if (currentPage + TOTAL_PAGE_T0_SHOW < pages) {
      _addElipsButton(buttonsArray, "last");
    }

    setButtons(() => buttonsArray);
  }, [pages]);

  useEffect(() => {
    const buttonsArray = [];
    _updateButtons(buttonsArray);
    setButtons(() => buttonsArray);
    pageClicked(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (pages === 1) {
      prevButton.current.disabled = true;
      nextButton.current.disabled = true;
    } else if (currentPage === 0) {
      prevButton.current.disabled = true;
      nextButton.current.disabled = false;
    } else if (currentPage === pages - 1) {
      nextButton.current.disabled = true;
      prevButton.current.disabled = false;
    } else {
      prevButton.current.disabled = false;
      nextButton.current.disabled = false;
    }
  }, [buttons]);

  /**
   * Chooses which buttons to display and addes '...' buttons where needed.
   * @param {Array} - buttonsArray
   */
  const _updateButtons = (buttonsArray) => {
    //First page
    if (currentPage === 0) {
      buttonsArray.push([..._createButtons(currentPage, TOTAL_PAGE_T0_SHOW)]);

      if (pages > TOTAL_PAGE_T0_SHOW) {
        _addElipsButton(buttonsArray, "last");
      }
    }
    //Last page
    else if (currentPage === pages - 1) {
      buttonsArray.push([..._createButtons(currentPage - 2, pages)]);

      if (pages > TOTAL_PAGE_T0_SHOW) {
        _addElipsButton(buttonsArray, "first");
      }
    }
    // any other page
    else {
      buttonsArray.push([..._createButtons(currentPage - 1, currentPage + 2)]);
      if (pages > TOTAL_PAGE_T0_SHOW) {
        if (currentPage - 1 > 0) {
          _addElipsButton(buttonsArray, "first");
        }
        if (currentPage + 2 < pages) {
          _addElipsButton(buttonsArray, "last");
        }
      }
    }
  };

  /**
   * Adds '...' buttons to start/end of array from position param.
   * @param {Array} buttonsArray
   * @param {String} position
   */
  const _addElipsButton = (buttonsArray, position) => {
    if (position === "first") {
      buttonsArray.unshift(
        <SlButton role="button" key={position} value={"..."} disabled>
          {"..."}
        </SlButton>
      );
    } else {
      buttonsArray.push(
        <SlButton role="button" key={position} value={"..."} disabled>
          {"..."}
        </SlButton>
      );
    }
  };

  /**
   * Creates an array of buttons with numbers on from params
   * @param {Number} start - first number to display on buttons
   * @param {Number} end - last number to display on buttons
   */
  const _createButtons = (start, end) => {
    const buttonsArray = [];
    for (let i = start; i < end; i++) {
      buttonsArray.push(
        <SlButton
          role="button"
          value={i}
          key={i}
          variant={i === currentPage ? "primary" : "default"}
          onClick={handleClick}
        >
          {i + 1}
        </SlButton>
      );
    }
    return buttonsArray;
  };

  /**
   * handles click on any buttons
   * @param {Object} event - button clicked element.
   */
  const handleClick = (event) => {
    const clickedVal = event.target.value;
    if (clickedVal === "next") {
      if (currentPage < pages - 1) {
        setCurrentPage(currentPage + 1);
      }
    } else if (clickedVal === "previous") {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    } else {
      setCurrentPage(clickedVal);
    }
  };

  return (
    <>
      <SlButtonGroup label="Alignment" role="group">
        <SlButton
          role="button"
          value="previous"
          onClick={handleClick}
          ref={prevButton}
        >
          Previous
        </SlButton>
        {buttons.map((button) => button)}
        <SlButton
          role="button"
          value="next"
          onClick={handleClick}
          ref={nextButton}
        >
          Next
        </SlButton>
      </SlButtonGroup>
    </>
  );
};

export default PaginationButtons;
