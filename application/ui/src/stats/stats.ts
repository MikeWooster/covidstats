import moment from "moment";
import { Moment } from "moment";
import {
  fetchAllStatsForDate,
  fetchStats,
  fetchStatsForLTLAs,
  StatsDataResponse,
} from "./statsAPI";
import { getNeighbouringLAs } from "./geo";
import { geocodePostCode } from "./postCodeAPI";

export enum AreaTypes {
  overview = "overview",
  nation = "nation",
  region = "region",
  postCode = "postCode",
}
export interface Stats {
  date: Moment;
  newCases: number;
  newDeaths: number;
}

export const getNations = async (): Promise<string[]> => {
  return Promise.resolve(["England", "Northern Ireland", "Scotland", "Wales"]);
};

export const getRegions = async (): Promise<string[]> => {
  const data = await fetchAllStatsForDate("2020-09-01");
  const regions = data
    .filter((p) => p.areaType === AreaTypes.region)
    .map((p) => p.areaName);
  return regions;
};

export const getStats = async (
  areaType: AreaTypes,
  refinedArea: string
): Promise<Stats[]> => {
  let stats: StatsDataResponse[] = [];
  if (areaType === AreaTypes.overview) {
    stats = await fetchStats(areaType, "");
  } else if (refinedArea === "") {
    stats = [];
  } else {
    stats = await fetchStats(areaType, refinedArea);
  }
  return formatStats(stats);
};

export const getStatsForPostCode = async (
  postCode: string,
  r: number
): Promise<Stats[]> => {
  if (r >= 100) {
    throw new Error(
      "Search distance is too large, try reducing the search, or change the data display type."
    );
  }
  const r_meters = r * 1000;
  const { lon, lat } = await geocodePostCode(postCode);
  const areaCodes = getNeighbouringLAs(lon, lat, r_meters);
  const stats = await fetchStatsForLTLAs(areaCodes);
  return formatStats(stats);
};

const formatStats = (stats: StatsDataResponse[]): Stats[] => {
  return aggregated(stats)
    .map((s) => ({
      ...s,
      date: moment(s.date, "YYYY-MM-DD"),
      newDeaths:
        s.newDeaths28DaysByDeathDate === null
          ? 0
          : s.newDeaths28DaysByDeathDate,
    }))
    .filter((s) => s.date <= moment().startOf("day"))
    .sort((a, b) => (a.date.isBefore(b.date) ? -1 : 1));
};

// aggregated will reduce the stats to a daily SUM when there are multiple days of stats.
// we will lose some of the info - i.e. the areaType/areaName, but oh well.
const aggregated = (stats: StatsDataResponse[]): StatsDataResponse[] => {
  const aggregator: { [date: string]: StatsDataResponse } = {};
  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];
    if (stat.date in aggregator) {
      aggregator[stat.date].newCases += stat.newCases;

      // New deaths can be reported as null - convert this to zero
      aggregator[stat.date].newDeaths28DaysByPublishDate =
        nullToZero(aggregator[stat.date].newDeaths28DaysByPublishDate) +
        nullToZero(stat.newDeaths28DaysByPublishDate);

      aggregator[stat.date].newDeaths28DaysByDeathDate =
        nullToZero(aggregator[stat.date].newDeaths28DaysByDeathDate) +
        nullToZero(stat.newDeaths28DaysByDeathDate);

      // aggregator[stat.newCasesRate].newCasesRate =
      //   (aggregator[stat.newCasesRate].newCasesRate + stat.newCasesRate) / 2;
    } else {
      aggregator[stat.date] = {
        ...stat,
        newDeaths28DaysByPublishDate: nullToZero(
          stat.newDeaths28DaysByPublishDate
        ),
      };
    }
  }
  return Object.values(aggregator);
};

const nullToZero = (v: number | null): number => {
  return v === null ? 0 : v;
};
