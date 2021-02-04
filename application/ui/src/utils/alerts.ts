import { NormalizedStats } from "../stats/stats";
import moment from "moment";

export const calculateCasesRatio = (stats: NormalizedStats, days: number, daysToDisregard: number): { casesRatio: number, activeCases: number, population: number } => {
  const population = stats.areas.map(area => area.population).reduce((a, b) => a + b, 0);
  const firstDay = moment().endOf("day").subtract(daysToDisregard + days, "day");
  const lastDay = moment().endOf("day").subtract(daysToDisregard, "day");
  const cases = stats.dates
  .filter(date => date.asMoment.isAfter(firstDay) && date.asMoment.isBefore(lastDay))
  .map(date => date.totals.totalCases)
  .reduce((a, b) => a + b, 0);
  return { casesRatio: cases > 0 ? population / cases : 0, activeCases: cases, population: population };
};