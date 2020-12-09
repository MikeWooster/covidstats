import moment, { Moment } from "moment";
import { nullToZero } from "../utils/math";
import { getNeighbouringLAs } from "./geo";
import {
  fetchLoadedStats,
  fetchLoadedStatsForLTLAs,
  LoadedResponse,
} from "./loadedStatsAPI";
import { geocodePostCode } from "./postCodeAPI";
import { fetchStats, fetchStatsForLTLAs, StatsDataResponse } from "./statsAPI";

export enum AreaTypes {
  overview = "overview",
  nation = "nation",
  region = "region",
  countyDistrict = "utla",
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
  population: number;
  maxTests: number | null;
  stats: string[];
}

interface Date {
  asString: string;
  asMoment: Moment;
  stats: string[];
  totals: {
    totalDeaths: number;
    totalCases: number;
    totalTests: number | null;
  };
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
  return Promise.resolve([
    "East Midlands",
    "East of England",
    "London",
    "North East",
    "North West",
    "South East",
    "South West",
    "West Midlands",
    "Yorkshire and The Humber",
  ]);
};

export const getCountyDistricts = async (): Promise<string[]> => {
  return Promise.resolve([
    "Aberdeen City",
    "Aberdeenshire",
    "Angus",
    "Antrim and Newtownabbey",
    "Ards and North Down",
    "Argyll and Bute",
    "Armagh City, Banbridge and Craigavon",
    "Barking and Dagenham",
    "Barnet",
    "Barnsley",
    "Bath and North East Somerset",
    "Bedford",
    "Belfast",
    "Bexley",
    "Birmingham",
    "Blackburn with Darwen",
    "Blackpool",
    "Blaenau Gwent",
    "Bolton",
    "Bournemouth, Christchurch and Poole",
    "Bracknell Forest",
    "Bradford",
    "Brent",
    "Bridgend",
    "Brighton and Hove",
    "Bristol, City of",
    "Bromley",
    "Buckinghamshire",
    "Bury",
    "Caerphilly",
    "Calderdale",
    "Cambridgeshire",
    "Camden",
    "Cardiff",
    "Carmarthenshire",
    "Causeway Coast and Glens",
    "Central Bedfordshire",
    "Ceredigion",
    "Cheshire East",
    "Cheshire West and Chester",
    "City of Edinburgh",
    "Clackmannanshire",
    "Comhairle nan Eilean Siar",
    "Conwy",
    "Cornwall and Isles of Scilly",
    "County Durham",
    "Coventry",
    "Croydon",
    "Cumbria",
    "Darlington",
    "Denbighshire",
    "Derby",
    "Derbyshire",
    "Derry City and Strabane",
    "Devon",
    "Doncaster",
    "Dorset",
    "Dudley",
    "Dumfries and Galloway",
    "Dundee City",
    "Ealing",
    "East Ayrshire",
    "East Dunbartonshire",
    "East Lothian",
    "East Renfrewshire",
    "East Riding of Yorkshire",
    "East Sussex",
    "Enfield",
    "Essex",
    "Falkirk",
    "Fermanagh and Omagh",
    "Fife",
    "Flintshire",
    "Gateshead",
    "Glasgow City",
    "Gloucestershire",
    "Greenwich",
    "Gwynedd",
    "Hackney and City of London",
    "Halton",
    "Hammersmith and Fulham",
    "Hampshire",
    "Haringey",
    "Harrow",
    "Hartlepool",
    "Havering",
    "Herefordshire, County of",
    "Hertfordshire",
    "Highland",
    "Hillingdon",
    "Hounslow",
    "Inverclyde",
    "Isle of Anglesey",
    "Isle of Wight",
    "Islington",
    "Kensington and Chelsea",
    "Kent",
    "Kingston upon Hull, City of",
    "Kingston upon Thames",
    "Kirklees",
    "Knowsley",
    "Lambeth",
    "Lancashire",
    "Leeds",
    "Leicester",
    "Leicestershire",
    "Lewisham",
    "Lincolnshire",
    "Lisburn and Castlereagh",
    "Liverpool",
    "Luton",
    "Manchester",
    "Medway",
    "Merthyr Tydfil",
    "Merton",
    "Mid and East Antrim",
    "Mid Ulster",
    "Middlesbrough",
    "Midlothian",
    "Milton Keynes",
    "Monmouthshire",
    "Moray",
    "Neath Port Talbot",
    "Newcastle upon Tyne",
    "Newham",
    "Newport",
    "Newry, Mourne and Down",
    "Norfolk",
    "North Ayrshire",
    "North East Lincolnshire",
    "North Lanarkshire",
    "North Lincolnshire",
    "North Somerset",
    "North Tyneside",
    "North Yorkshire",
    "Northamptonshire",
    "Northumberland",
    "Nottingham",
    "Nottinghamshire",
    "Oldham",
    "Orkney Islands",
    "Oxfordshire",
    "Pembrokeshire",
    "Perth and Kinross",
    "Peterborough",
    "Plymouth",
    "Portsmouth",
    "Powys",
    "Reading",
    "Redbridge",
    "Redcar and Cleveland",
    "Renfrewshire",
    "Resident outside Wales",
    "Rhondda Cynon Taf",
    "Richmond upon Thames",
    "Rochdale",
    "Rotherham",
    "Rutland",
    "Salford",
    "Sandwell",
    "Scottish Borders",
    "Sefton",
    "Sheffield",
    "Shetland Islands",
    "Shropshire",
    "Slough",
    "Solihull",
    "Somerset",
    "South Ayrshire",
    "South Gloucestershire",
    "South Lanarkshire",
    "South Tyneside",
    "Southampton",
    "Southend-on-Sea",
    "Southwark",
    "St. Helens",
    "Staffordshire",
    "Stirling",
    "Stockport",
    "Stockton-on-Tees",
    "Stoke-on-Trent",
    "Suffolk",
    "Sunderland",
    "Surrey",
    "Sutton",
    "Swansea",
    "Swindon",
    "Tameside",
    "Telford and Wrekin",
    "Thurrock",
    "Torbay",
    "Torfaen",
    "Tower Hamlets",
    "Trafford",
    "Vale of Glamorgan",
    "Wakefield",
    "Walsall",
    "Waltham Forest",
    "Wandsworth",
    "Warrington",
    "Warwickshire",
    "West Berkshire",
    "West Dunbartonshire",
    "West Lothian",
    "West Sussex",
    "Westminster",
    "Wigan",
    "Wiltshire",
    "Windsor and Maidenhead",
    "Wirral",
    "Wokingham",
    "Wolverhampton",
    "Worcestershire",
    "Wrexham",
    "York",
  ]);
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

// getLoadedStats returns stats from our local stored stats.
export const getLoadedStats = async (
  areaType: AreaTypes,
  refinedArea: string
): Promise<NormalizedStats> => {
  if (areaType === AreaTypes.overview) {
    refinedArea = "United Kingdom";
  }

  const stats = await fetchLoadedStats(areaType, refinedArea);
  return formatLoadedStats([stats]);
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

// getLoadedStatsForPostCode gets ltla data from our stored stats.
export const getLoadedStatsForPostCode = async (
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
  const stats = await fetchLoadedStatsForLTLAs(areaCodes);
  return formatLoadedStats(stats);
};

// formatLoadedStats maps the stored stats into the normalized stats
// format required for graphing
const formatLoadedStats = (stats: LoadedResponse[]): NormalizedStats => {
  const ns: NormalizedStats = { stats: {}, areas: [], dates: [] };
  const areas: { [key: string]: Area } = {};
  const dates: { [key: string]: Date } = {};

  for (let i = 0; i < stats.length; i++) {
    const areaStat = stats[i];
    areas[areaStat.areaCode] = {
      areaCode: areaStat.areaCode,
      areaName: areaStat.areaName,
      population: areaStat.population,
      maxTests: areaStat.maxTests,
      stats: [],
    };

    for (let j = 0; j < areaStat.stats.length; j++) {
      const stat = areaStat.stats[j];
      const statKey = `${stat.date}-${areaStat.areaCode}`;
      ns.stats[statKey] = {
        date: moment(stat.date, "YYYY-MM-DD"),
        newCases: stat.newCases,
        newDeaths: stat.newDeaths,
        newTests: stat.newTests,
      };

      areas[areaStat.areaCode].stats.push(statKey);

      if (!(stat.date in dates)) {
        dates[stat.date] = {
          asString: stat.date,
          asMoment: ns.stats[statKey].date,
          stats: [],
          totals: { totalCases: 0, totalDeaths: 0, totalTests: 0 },
        };
      }
      dates[stat.date].stats.push(statKey);
    }
  }

  // Calculate the daily totals
  for (let key in dates) {
    dates[key].totals.totalCases = dates[key].stats
      .map((st) => ns.stats[st].newCases)
      .reduce((a, b) => a + b, 0);
    dates[key].totals.totalDeaths = dates[key].stats
      .map((st) => ns.stats[st].newDeaths)
      .reduce((a, b) => a + b, 0);
    dates[key].totals.totalTests = dates[key].stats
      .map((st) => ns.stats[st].newTests)
      .reduce((a, b) => (a || 0) + (b || 0), 0);
  }

  // Add the dates/areas to the normalized stats
  // Dates must also be sorted oldest to newest.
  ns.dates = Object.values(dates).sort((a, b) =>
    a.asMoment.isBefore(b.asMoment) ? -1 : 1
  );
  ns.areas = Object.values(areas);

  return ns;
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

    // Some metrics are not available for specific areaType values.
    // For instance, we have newCasesByPublishDate and
    // cumCasesByPublishDate only available for areaType=nation but
    // not for region,utla, or ltla. Conversely, we have
    // newCasesBySpecimenDate and cumCasesBySpecimenDate available
    // for region, utla, and ltla but not for nation.

    const statKey = `${stat.date}-${stat.areaCode}`;
    ns.stats[statKey] = {
      date: moment(stat.date, "YYYY-MM-DD"),
      newCases: ["overview", "nation"].includes(areaType)
        ? stat.newCasesByPublishDate
        : stat.newCasesBySpecimenDate,
      newDeaths: nullToZero(
        ["overview", "nation"].includes(areaType)
          ? stat.newDeaths28DaysByPublishDate
          : stat.newDeaths28DaysByDeathDate
      ),
      newTests: stat.newPCRTestsByPublishDate,
    };

    if (!(stat.areaCode in areas)) {
      areas[stat.areaCode] = {
        areaCode: stat.areaCode,
        areaName: stat.areaName,
        population: 0,
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
        totals: { totalCases: 0, totalDeaths: 0, totalTests: 0 },
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

  // Calculate the daily totals
  for (let key in dates) {
    dates[key].totals.totalCases = dates[key].stats
      .map((st) => ns.stats[st].newCases)
      .reduce((a, b) => a + b, 0);
    dates[key].totals.totalDeaths = dates[key].stats
      .map((st) => ns.stats[st].newDeaths)
      .reduce((a, b) => a + b, 0);
    dates[key].totals.totalTests = dates[key].stats
      .map((st) => ns.stats[st].newTests)
      .reduce((a, b) => (a || 0) + (b || 0), 0);
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
