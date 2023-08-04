import { describe, test, expect } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";

import App from "../../src/app";

// --------------------------------- General Setup ----------------------------------------------
const server = setupServer(
  rest.get("https://api.spacexdata.com/v5/launches", (req, res, ctx) => {
    const results = [];
    // Push 10 successful launches
    for (let i = 0; i < 10; i++) {
      results.push({
        links: {
          flickr: {
            original: ["./test/utils/testImage.jpg"],
          },
        },
        success: true,
        details: `Sucessful launch-${i}`,
        flight_number: i,
        name: `FalconSat-${i}`,
        date_utc: "2006-03-24T22:30:00.000Z",
        upcoming: false,
        id: `5eb87cd9ffd86e000604b32a-${i}`,
      });
    }

    // Push an upcoming launch
    results.push({
      links: {
        flickr: {
          original: ["./test/utils/testImage.jpg"],
        },
      },
      success: true,
      details: `Launch upcoming`,
      flight_number: 20,
      name: `FalconSat-upcoming`,
      date_utc: "2006-03-24T22:30:00.000Z",
      upcoming: true,
      id: `5eb87cd9ffd86e000604b32a-upcoming`,
    });

    // Unsuccessful Launch
    results.push({
      links: {
        flickr: {
          original: ["./test/utils/testImage.jpg"],
        },
      },
      success: false,
      details: `Launch failed`,
      flight_number: 99,
      name: `FalconSat-failed`,
      date_utc: "2006-03-24T22:30:00.000Z",
      upcoming: false,
      id: `5eb87cd9ffd86e000604b32a-failed`,
    });

    return res(ctx.json(results));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// --------------------------------- Tests ----------------------------------------------

describe("<App />", () => {
  describe("Positive", () => {
    describe("Initialization", () => {
      test("should mount App and show basic data", async () => {
        // ARRANGE
        const wrapper = render(<App />);
        const heading = await screen.findByText(/Launch Data/i);
        const filters = await screen.findByText(/Filters/i);
        const cards = screen.getAllByRole("card");
        const pageButtonGroup = screen.getAllByRole("group");

        // ASSERT
        expect(wrapper).toBeTruthy();
        expect(heading, "should have expected heading").toBeTruthy();
        expect(filters, "should have filters").toBeTruthy();
        expect(cards.length, "should have filters").toBe(6);
        expect(pageButtonGroup, "should grouped buttons").toBeTruthy();
      });
    });

    describe("Functional", () => {
      describe("Pagination", () => {
        test("should update rendered cards when Next/Prev pagination buttons clicked", async () => {
          // ARRANGE
          const wrapper = render(<App />);
          let card = await screen.findByText("Sucessful launch-0");
          let cardNext = screen.queryByText("Sucessful launch-6");
          const prevButton = await screen.findByText("Previous");
          expect(
            cardNext,
            "should currently not have card from next page"
          ).toBeNull();
          const nextButton = await screen.findByText("Next");

          // ACT
          fireEvent.click(nextButton);

          // ASSERT
          card = await screen.findByText("Sucessful launch-6");
          const cardPrev = screen.queryByText("Sucessful launch-0");
          expect(
            cardPrev,
            "should currently not have card from first page"
          ).toBeNull();

          // ACT
          fireEvent.click(prevButton);

          // ASSERT
          card = await screen.findByText("Sucessful launch-0");
          cardNext = screen.queryByText("Sucessful launch-6");
          expect(
            cardNext,
            "should currently not have card from next page"
          ).toBeNull();
        });

        test("should go to expected page when number button clicked", async () => {
          const wrapper = render(<App />);
          let card = await screen.findByText("Sucessful launch-0");
          let cardNext = screen.queryByText("Sucessful launch-6");
          expect(
            cardNext,
            "should currently not have card from next page"
          ).toBeNull();
          const twoButton = await screen.findByText("2");

          // ACT
          fireEvent.click(twoButton);

          // ASSERT
          card = await screen.findByText("Sucessful launch-6");
          const cardPrev = screen.queryByText("Sucessful launch-0");
          expect(
            cardPrev,
            "should currently not have card from first page"
          ).toBeNull();
        });
      });

      describe("Filtering", () => {
        test("should update cards with filter and then show all again with removed filter", async () => {
          // ARRANGE
          const wrapper = render(<App />);
          let card = await screen.findByText("Sucessful launch-0");
          let unsuccessfulCard = screen.queryByText("Launch failed");
          expect(
            unsuccessfulCard,
            "should currently not have unsuccessfulCard from next page"
          ).toBeNull();
          // Wanted to click text here but error thrown by 3PP shoelace
          const dropdown = await screen.findByRole("listbox");
          // ACT
          fireEvent.click(dropdown);
          const unsucessfulFilter = await screen.findAllByRole("checkbox");

          // Another issue with clicking the checkbox here. Wouldn't work so had to set it like so.
          // fireEvent.click(unsucessfulFilter[2]);
          unsucessfulFilter[2].checked = true;
          let applyButton = await screen.findByText(/Apply/i);
          fireEvent.click(applyButton);
          // ASSERT
          unsuccessfulCard = await screen.findByText("Launch failed");
          card = screen.queryByText("Sucessful launch-0");
          expect(
            card,
            "should currently not have card from first page"
          ).toBeNull();

          // ACT
          unsucessfulFilter[2].checked = false;
          applyButton = await screen.findByText(/Apply/i);
          fireEvent.click(applyButton);

          // ASSERT
          unsuccessfulCard = await screen.findByText("Sucessful launch-0");
          card = screen.queryByText("Launch Failed");
          expect(
            card,
            "should currently not have card from next page"
          ).toBeNull();
        });
      });

      describe("Sorting", () => {
        test("should update cards sort cards on apply", async () => {
          // ARRANGE
          const wrapper = render(<App />);
          let card = await screen.findByText("Flight Number: 0");
          let lastCard = screen.queryByText("Flight Number: 99");
          expect(
            lastCard,
            "should currently not have lastCard from next page"
          ).toBeNull();
          // Wanted to click text here but error thrown by 3PP shoelace
          const dropdown = await screen.findByRole("listbox");
          // ACT
          fireEvent.click(dropdown);
          const dscRadio = await screen.findByText("Descending");

          fireEvent.click(dscRadio);
          let applyButton = await screen.findByText(/Apply/i);
          fireEvent.click(applyButton);
          // ASSERT
          lastCard = await screen.findByText("Flight Number: 99");
          card = screen.queryByText("Flight Number: 0");
          expect(
            card,
            "should currently not have card from first page"
          ).toBeNull();

          // ACT
          fireEvent.click(dropdown);
          const ascRadio = await screen.findByText("Ascending");

          fireEvent.click(ascRadio);
          applyButton = await screen.findByText(/Apply/i);
          fireEvent.click(applyButton);
          // ASSERT
          lastCard = await screen.findByText("Flight Number: 0");
          card = screen.queryByText("Flight Number: 99");
          expect(
            card,
            "should currently not have card from first page"
          ).toBeNull();
        });
      });
    });
  });

  describe("Negative", () => {
    describe("Error State", () => {
      test("should show error message when fetch returns 500 error", async () => {
        // ARRANGE
        server.use(
          rest.get(
            "https://api.spacexdata.com/v5/launches",
            (req, res, ctx) => {
              return res(ctx.status(500));
            }
          )
        );
        const wrapper = render(<App />);
        const errorMessage = await screen.findByText(
          /Error loading data. please try again later/i
        );

        // ASSERT
        expect(wrapper).toBeTruthy();
        expect(errorMessage, "should have shown error").toBeTruthy();
      });
    });
  });
});
