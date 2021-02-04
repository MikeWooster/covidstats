import moment from "moment";
import { NormalizedStats } from "../stats/stats";
import { calculateCasesRatio } from "./alerts";

test("calculateCasesRatio", () => {
  const d1 = moment().subtract(3, "days");
  const d2 = moment().subtract(2, "days");
  const d3 = moment().subtract(1, "days");

  const stats: NormalizedStats = {
    stats: {
      "a": {
        date: d1,
        newCases: 10000,
        newDeaths: 0,
        newTests: 0,
      },
      "b": {
        date: d2,
        newCases: 20000,
        newDeaths: 0,
        newTests: 0,
      },
      "c": {
        date: d3,
        newCases: 30000,
        newDeaths: 0,
        newTests: 0,
      },
    },
    areas: [
      {
        areaCode: "12345",
        areaName: "Foo",
        population: 100000,
        maxTests: 40000,
        stats: ["a", "b", "c"],
      },
    ],
    dates: [
      {
        asString: "",
        asMoment: d1,
        stats: ["a"],
        totals: {
          totalDeaths: 0,
          totalCases: 10000,
          totalTests: 0,
        },
      },
      {
        asString: "",
        asMoment: d2,
        stats: ["a"],
        totals: {
          totalDeaths: 0,
          totalCases: 20000,
          totalTests: 0,
        },
      },
      {
        asString: "",
        asMoment: d3,
        stats: ["a"],
        totals: {
          totalDeaths: 0,
          totalCases: 30000,
          totalTests: 0,
        },
      },
    ],
  };

  const got = calculateCasesRatio(stats, 3, 0);
  expect(got).toEqual({ casesRatio: 2, activeCases: 50000, population: 100000 });
});
