import moment, { Moment } from "moment";
import { getNeighbouringLAs } from "./geo";
import { geocodePostCode } from "./postCodeAPI";
import {
  fetchAllRegionStatsForDate,
  fetchStats,
  fetchStatsForLTLAs,
  StatsDataResponse,
} from "./statsAPI";

export enum AreaTypes {
  overview = "overview",
  nation = "nation",
  region = "region",
  postCode = "postCode",
}

export interface Stat {
  date: Moment;
  newCases: number;
  newDeaths: number;
  newTests: number | null;
}

interface Area {
  areaCode: string;
  areaName: string;
  population: number | null;
  maxTests: number | null;
  stats: string[];
}

interface Date {
  asString: string;
  asMoment: Moment;
  stats: string[];
  totals: { totalDeaths: number; totalCases: number };
}

export interface NormalizedStats {
  stats: { [key: string]: Stat };
  areas: Area[];
  dates: Date[];
}

export const EMPTY_STATS: NormalizedStats = {
  stats: {},
  areas: [],
  dates: [],
};

export const getNations = async (): Promise<string[]> => {
  return Promise.resolve(["England", "Northern Ireland", "Scotland", "Wales"]);
};

export const getRegions = async (): Promise<string[]> => {
  const data = await fetchAllRegionStatsForDate("2020-09-01");
  const regions = data
    .filter((p) => p.areaType === AreaTypes.region)
    .map((p) => p.areaName);
  return regions;
};

export const getStats = async (
  areaType: AreaTypes,
  refinedArea: string
): Promise<NormalizedStats> => {
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
): Promise<NormalizedStats> => {
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

const formatStats = (stats: StatsDataResponse[]): NormalizedStats => {
  const ns: NormalizedStats = { stats: {}, areas: [], dates: [] };
  const areas: { [key: string]: Area } = {};
  const dates: { [key: string]: Date } = {};

  // Keep track of the area type - we don't want to mix different
  // area types in our response, as this will indicate we are double
  // counting cases, etc.
  let areaType: string | null = null;

  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];

    if (areaType !== null && stat.areaType !== areaType) {
      continue;
    }
    areaType = stat.areaType;

    const statKey = `${stat.date}-${stat.areaCode}`;
    ns.stats[statKey] = {
      date: moment(stat.date, "YYYY-MM-DD"),
      newCases: stat.newCasesBySpecimenDate,
      newDeaths: nullToZero(stat.newDeaths28DaysByDeathDate),
      newTests: stat.newPCRTestsByPublishDate,
    };

    if (!(stat.areaCode in areas)) {
      areas[stat.areaCode] = {
        areaCode: stat.areaCode,
        areaName: stat.areaName,
        population: null,
        maxTests: null,
        stats: [],
      };
    }
    areas[stat.areaCode].stats.push(statKey);
    const population = calculatePopulation(stat);
    if (population !== null) {
      areas[stat.areaCode].population = population;
    }

    if (!(stat.date in dates)) {
      dates[stat.date] = {
        asString: stat.date,
        asMoment: ns.stats[statKey].date,
        stats: [],
        totals: { totalCases: 0, totalDeaths: 0 },
      };
    }
    dates[stat.date].stats.push(statKey);
  }

  // Calculate the maximum number of tests per area
  for (let key in areas) {
    areas[key].maxTests = getMaxTests(
      areas[key].stats.map((st) => ns.stats[st])
    );
  }

  // Calculate the total cases per day
  for (let key in dates) {
    dates[key].totals.totalCases = dates[key].stats
      .map((st) => ns.stats[st].newCases)
      .reduce((a, b) => a + b, 0);
    dates[key].totals.totalDeaths = dates[key].stats
      .map((st) => ns.stats[st].newDeaths)
      .reduce((a, b) => a + b, 0);
  }

  // Add the dates/areas to the normalized stats
  // Dates must also be sorted oldest to newest.
  ns.dates = Object.values(dates).sort((a, b) =>
    a.asMoment.isBefore(b.asMoment) ? -1 : 1
  );
  ns.areas = Object.values(areas);

  return ns;
};

const getMaxTests = (stats: Stat[]): number | null => {
  let numTests: number | null = null;
  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];
    if (
      numTests === null ||
      (stat.newTests !== null && stat.newTests > numTests)
    ) {
      numTests = stat.newTests;
    }
  }
  return numTests;
};
// aggregated will reduce the stats to a daily SUM when there are multiple days of stats.
// we will lose some of the info - i.e. the areaType/areaName, but oh well.
const aggregated = (stats: StatsDataResponse[]): StatsDataResponse[] => {
  const aggregator: { [date: string]: StatsDataResponse } = {};
  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];
    if (stat.date in aggregator) {
      aggregator[stat.date].newCasesBySpecimenDate +=
        stat.newCasesBySpecimenDate;

      // New deaths can be reported as null - convert this to zero
      aggregator[stat.date].newDeaths28DaysByPublishDate = sumVals(
        aggregator[stat.date].newDeaths28DaysByPublishDate,
        stat.newDeaths28DaysByPublishDate
      );

      aggregator[stat.date].newDeaths28DaysByDeathDate = sumVals(
        aggregator[stat.date].newDeaths28DaysByDeathDate,
        stat.newDeaths28DaysByDeathDate
      );

      aggregator[stat.date].newPCRTestsByPublishDate = sumVals(
        aggregator[stat.date].newPCRTestsByPublishDate,
        stat.newPCRTestsByPublishDate
      );

      aggregator[
        stat.date
      ].cumCasesByPublishDateRate = calcNewCumCasesByPublishDateRate(
        aggregator[stat.date],
        stat
      );

      aggregator[stat.date].cumCasesByPublishDate = sumVals(
        aggregator[stat.date].cumCasesByPublishDate,
        stat.cumCasesByPublishDate
      );
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

const sumVals = (a: number | null, b: number | null): number | null => {
  if (a === null && b === null) {
    return null;
  }
  if (a === null) {
    return b;
  }
  if (b === null) {
    return a;
  }
  return a + b;
};

const calcNewCumCasesByPublishDateRate = (
  a: StatsDataResponse,
  b: StatsDataResponse
): number | null => {
  const aPop = calculatePopulation(a);
  const bPop = calculatePopulation(b);

  if (aPop === null) {
    return b.cumCasesByPublishDateRate;
  }
  if (bPop === null) {
    return a.cumCasesByPublishDateRate;
  }

  const newTotal =
    (a.cumCasesByPublishDate as number) + (b.cumCasesByPublishDate as number);
  const newPop = aPop + bPop;

  return (100000 * newTotal) / newPop;
};

const calculatePopulation = (s: StatsDataResponse): number | null => {
  const {
    cumCasesByPublishDate: totalCases,
    cumCasesByPublishDateRate: rate,
  } = s;

  if (totalCases === null || rate === null) {
    return null;
  }
  const pop = (100000 * totalCases) / rate;
  if (isNaN(pop) || !isFinite(pop)) {
    return null;
  }
  return pop;
};
