import { fireEvent, render } from "@testing-library/react";
import InfoPopup from "./InfoPopup";
import React from "react";

describe("InfoPopup", () => {
  it("renders the popup message on hover", async () => {
    const { getByTestId } = render(
      <InfoPopup header={"test "} content={<div>content</div>} />
    );

    // I've been unable to simulate a hover event to render the popup.
    // using a click for now.
    fireEvent.click(getByTestId("popup-trigger"));

    const content = getByTestId("popup-content");
    expect(content).toHaveTextContent("test content");
  });
});
