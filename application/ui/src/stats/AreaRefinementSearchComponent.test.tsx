import React from "react";
import AreaRefinementSearch from "./AreaRefinementSearchComponent";
import { fireEvent, getAllByRole, render } from "@testing-library/react";
import { AreaTypes } from "./stats";

describe("AreaRefinementSearchComponent", () => {
  it("is disabled when working in overview mode", () => {
    const getStats = jest.fn();
    const setRefinedArea = jest.fn();

    const { getByTestId } = render(
      <AreaRefinementSearch
        areaType={AreaTypes.overview}
        countyDistricts={[]}
        getStats={getStats}
        nations={[]}
        refinedArea={""}
        regions={[]}
        setRefinedArea={setRefinedArea}
      />
    );

    const dropdown = getByTestId("areaRefinementSearchInput");

    // Get the currently displayed option
    const display = dropdown.children[0];
    expect(display.textContent).toBe("");

    expect(dropdown).toHaveClass("disabled");
  });

  it("displays correct search options for regions", () => {
    const getStats = jest.fn();
    const setRefinedArea = jest.fn();

    const { getByTestId } = render(
      <AreaRefinementSearch
        areaType={AreaTypes.region}
        countyDistricts={[]}
        getStats={getStats}
        nations={[]}
        refinedArea={"r1"}
        regions={["r1", "r2", "r3"]}
        setRefinedArea={setRefinedArea}
      />
    );

    const dropdown = getByTestId("areaRefinementSearchInput");

    // Get the currently displayed option
    const display = dropdown.children[0];
    expect(display.textContent).toBe("r1");

    // Is not disabled
    expect(dropdown).not.toHaveClass("disabled");

    // Has the correct regions available for selection
    const dropdownOptions = getAllByRole(dropdown, "option");
    expect(dropdownOptions.map((opt) => opt.textContent)).toEqual([
      "r1",
      "r2",
      "r3",
    ]);
  });

  it("fires correct events when selecting an option", () => {
    const getStats = jest.fn();
    const setRefinedArea = jest.fn();

    const { getByTestId } = render(
      <AreaRefinementSearch
        areaType={AreaTypes.region}
        countyDistricts={[]}
        getStats={getStats}
        nations={[]}
        refinedArea={"r1"}
        regions={["r1", "r2", "r3"]}
        setRefinedArea={setRefinedArea}
      />
    );

    const dropdown = getByTestId("areaRefinementSearchInput");

    // Get the currently displayed option
    const display = dropdown.children[0];
    expect(display.textContent).toBe("r1");

    // Is not disabled
    expect(dropdown).not.toHaveClass("disabled");

    // Has the correct regions available for selection
    const dropdownOptions = getAllByRole(dropdown, "option");

    // Change the dropdown to r3
    fireEvent.click(dropdownOptions[2]);

    expect(getStats.mock.calls[0]).toEqual([AreaTypes.region, "r3"]);
    expect(setRefinedArea.mock.calls[0]).toEqual(["r3"]);
  });
});
