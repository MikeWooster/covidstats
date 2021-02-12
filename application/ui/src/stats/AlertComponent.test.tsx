import React from "react";
import AlertComponent from "./AlertComponent";
import moment from "moment";
import { NormalizedStats } from "./stats";
import { render } from "@testing-library/react";

test.each([
  { cases: 1, population: 1, message: "Alert: Very High" },
  { cases: 1, population: 100, message: "Alert: Very High" },
  { cases: 1, population: 101, message: "Alert: High" },
  { cases: 1, population: 300, message: "Alert: High" },
  { cases: 1, population: 301, message: "Alert: Medium" },
  { cases: 1, population: 1000, message: "Alert: Medium" },
  { cases: 1, population: 1001, message: "Alert: Low" },
  { cases: 1, population: 10000, message: "Alert: Low" },
  { cases: 1, population: 10001, message: "Alert: Very Low" },
])("AlertComponent renders correct alert message", ({ cases, population, message }) => {
    const d1 = moment().subtract(3, "days");
    const thisStats: NormalizedStats = {
      stats: {
        "a": {
          date: d1,
          newCases: cases,
          newDeaths: 0,
          newTests: 0,
        },
      },
      areas: [
        {
          areaCode: "12345",
          areaName: "Foo",
          population: population,
          maxTests: 0,
          stats: ["a"],
        },
      ],
      dates: [
        {
          asString: "",
          asMoment: d1,
          stats: ["a"],
          totals: {
            totalDeaths: 0,
            totalCases: cases,
            totalTests: 0,
          },
        },
      ],
    };
    const { getByText } = render(<AlertComponent stats={thisStats} daysToDisregard={0} />);
    expect(getByText(message)).toBeInTheDocument();
  },
)
;
