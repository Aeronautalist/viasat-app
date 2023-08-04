import { describe, test, expect } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";

import PaginationButtons from "../../src/components/pagination-buttons/pagination-buttons";

describe("<PaginationButtons />", () => {
  describe("Initialization", () => {
    test("should render expected pagination buttons on init", async () => {
      // ARRANGE
      const wrapper = render(<PaginationButtons pages={3} />);
      const expectedButtons = ["Previous", "1", "2", "3", "Next"];
      const allButtons = screen.getAllByRole("button");

      // ASSERT
      expect(allButtons.length, "should have expected number of buttons").toBe(
        expectedButtons.length
      );
      allButtons.forEach((button, i) => {
        expect(button.textContent).toBe(expectedButtons[i]);
      });
      expect(
        allButtons[0].disabled,
        "Previous should be disabled"
      ).toBeTruthy();
      expect(allButtons[4].disabled, "Next should not be disabled").toBeFalsy();
    });

    test("should render ... button when there are more than 3 pages", async () => {
      // ARRANGE
      const wrapper = render(<PaginationButtons pages={5} />);
      const expectedButtons = ["Previous", "1", "2", "3", "...", "Next"];
      const allButtons = screen.getAllByRole("button");

      // ASSERT
      expect(allButtons.length, "should have expected number of buttons").toBe(
        expectedButtons.length
      );
      allButtons.forEach((button, i) => {
        expect(button.textContent).toBe(expectedButtons[i]);
      });
    });

    test("should render ... button when more than 3 pages", async () => {
      // ARRANGE
      const wrapper = render(<PaginationButtons pages={5} />);
      const allButtons = screen.getAllByRole("button");

      // ASSERT
      expect(allButtons[4].textContent).toBe("...");
    });

    test("should disabled next/previous when only 1 page", async () => {
      // ARRANGE
      const wrapper = render(<PaginationButtons pages={1} />);
      const allButtons = screen.getAllByRole("button");

      // ASSERT
      expect(allButtons[0].disabled).toBeTruthy;
      expect(allButtons[2].disabled).toBeTruthy;
    });
  });

  describe("Functional", () => {
    describe("Button Press", () => {
      test("should update buttons accordingly when last visible number clicked", async () => {
        // ARRANGE
        const wrapper = render(<PaginationButtons pages={5} />);
        const expectedUpdatedButtons = [
          "Previous",
          "...",
          "2",
          "3",
          "4",
          "...",
          "Next",
        ];
        const lastVisibleNumber = await screen.findByText(3);

        // ACT
        fireEvent.click(lastVisibleNumber);

        // ASSERT
        const allButtons = await screen.findAllByRole("button");
        allButtons.forEach((button, i) => {
          expect(button.textContent).toBe(expectedUpdatedButtons[i]);
        });
      });

      test("should disable next button when last page clicked", async () => {
        // ARRANGE
        const wrapper = render(<PaginationButtons pages={4} />);
        const expectedUpdatedButtons = [
          "Previous",
          "...",
          "2",
          "3",
          "4",
          "Next",
        ];
        const lastVisibleNumber = await screen.findByText(3);
        const nextButton = await screen.findByText("Next");

        // ACT
        fireEvent.click(lastVisibleNumber);
        fireEvent.click(nextButton);

        // ASSERT
        const allButtons = await screen.findAllByRole("button");
        allButtons.forEach((button, i) => {
          expect(button.textContent).toBe(expectedUpdatedButtons[i]);
        });

        expect(nextButton.disabled, "Next should be disabled").toBeTruthy();
        expect(
          allButtons[0].disabled,
          "Previous should not be disabled"
        ).toBeFalsy();
      });
    });
  });
});
