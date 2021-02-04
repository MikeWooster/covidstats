import { fireEvent, getAllByRole, render } from "@testing-library/react";
import AreaOptionsSelect from "./AreaOptionsSelectComponent";
import React from "react";
import { AreaTypes } from "./stats";

describe("AreaOptionsSelectComponent", () => {
  it("gets stats when selecting overview", () => {
    const setAreaType = jest.fn();
    const setRefinedArea = jest.fn();
    const getStats = jest.fn();

    const { getByTestId } = render(
      <AreaOptionsSelect
        nations={[]}
        regions={[]}
        countyDistricts={[]}
        areaType={AreaTypes.nation}
        setAreaType={setAreaType}
        setRefinedArea={setRefinedArea}
        getStats={getStats}
      />,
    );

    const dropdown = getByTestId("areaTypeSelectInput");
    // Get the currently displayed option
    const display = dropdown.children[0];
    expect(display.textContent).toBe("Nation");

    // To display all options, first click the dropdown
    fireEvent.click(dropdown);

    const dropdownOptions = getAllByRole(dropdown, "option");
    expect(dropdownOptions[0].textContent).toBe("All UK");

    // Changing the dropdown to All UK
    fireEvent.click(dropdownOptions[0]);

    expect(setAreaType.mock.calls[0]).toEqual([AreaTypes.overview]);
    expect(setRefinedArea.mock.calls.length).toBe(0);
    expect(getStats.mock.calls[0]).toEqual([AreaTypes.overview, ""]);

  });

  it("gets stats when selecting district", () => {
    const setAreaType = jest.fn();
    const setRefinedArea = jest.fn();
    const getStats = jest.fn();

    const { getByTestId } = render(
      <AreaOptionsSelect
        nations={[]}
        regions={[]}
        countyDistricts={["d1", "d2"]}
        areaType={AreaTypes.nation}
        setAreaType={setAreaType}
        setRefinedArea={setRefinedArea}
        getStats={getStats}
      />,
    );

    const dropdown = getByTestId("areaTypeSelectInput");
    // Get the currently displayed option
    const display = dropdown.children[0];
    expect(display.textContent).toBe("Nation");

    // To display all options, first click the dropdown
    fireEvent.click(dropdown);

    const dropdownOptions = getAllByRole(dropdown, "option");
    expect(dropdownOptions[3].textContent).toBe("County/District");

    // Changing the dropdown to County/District
    fireEvent.click(dropdownOptions[3]);

    expect(setAreaType.mock.calls[0]).toEqual([AreaTypes.countyDistrict]);
    expect(setRefinedArea.mock.calls[0]).toEqual(["d1"]);
    expect(getStats.mock.calls[0]).toEqual([AreaTypes.countyDistrict, "d1"]);
  });
});