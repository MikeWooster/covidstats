import { AreaTypes } from "./stats";

// Simple cache to save repeated lookups.
const cache: { [key: string]: StatsResponse } = {};

const base_url = "https://api.coronavirus.data.gov.uk";

export interface StatsDataResponse {
  areaType: string;
  areaName: string;
  areaCode: string;
  date: string;
  newCasesBySpecimenDate: number;
  cumCasesBySpecimenDateRate: number;
  newDeaths28DaysByPublishDate: number | null;
  newDeaths28DaysByDeathDate: number | null;
  newPCRTestsByPublishDate: number | null;
}
interface StatsResponse {
  data: StatsDataResponse[];
  length: number;
  maxPageLimit: number;
  pagination: {
    current: string;
    first: string;
    last: string;
    next: string | null;
    previous: string | null;
  };
}

export const fetchAllStatsForDate = async (
  date: string
): Promise<StatsDataResponse[]> => {
  const filters: { [key: string]: string } = {
    date: date,
  };

  const url = buildURL(filters);
  return await paginate(url);
};

export const fetchStats = async (
  areaType: string,
  areaName: string
): Promise<StatsDataResponse[]> => {
  const filters: { [key: string]: string } = {
    areaType: areaType,
  };

  if (areaType !== AreaTypes.overview) {
    filters.areaName = areaName;
  }

  const url = buildURL(filters);
  return await paginate(url);
};

export const fetchStatsForLTLAs = async (
  codes: string[]
): Promise<StatsDataResponse[]> => {
  const stats: StatsDataResponse[] = [];
  const extendStats = (newStats: StatsDataResponse[]) => {
    for (let i = 0; i < newStats.length; i++) {
      stats.push(newStats[i]);
    }
  };
  for (let i = 0; i < codes.length; i++) {
    const newStats = await paginate(
      buildURL({ areaType: "ltla", areaCode: codes[i] })
    );
    extendStats(newStats);
  }
  return stats;
};

const buildURL = (filters: { [key: string]: string }): string => {
  const structure = {
    date: "date",
    areaType: "areaType",
    areaName: "areaName",
    areaCode: "areaCode",
    newCasesBySpecimenDate: "newCasesBySpecimenDate",
    cumCasesBySpecimenDateRate: "cumCasesBySpecimenDateRate",
    newDeaths28DaysByPublishDate: "newDeaths28DaysByPublishDate",
    newDeaths28DaysByDeathDate: "newDeaths28DaysByDeathDate",
    newPCRTestsByPublishDate: "newPCRTestsByPublishDate",
  };
  const params = encodeParams({
    filters: encodeFilters(filters),
    structure: encodeStructure(structure),
  });
  return `${base_url}/v1/data?${params}`;
};

const encodeFilters = (filters: { [key: string]: string }): string => {
  return Object.keys(filters)
    .map(
      (k: string) =>
        encodeURIComponent(k) + "=" + encodeURIComponent(filters[k])
    )
    .join(";");
};

const encodeStructure = (filters: { [key: string]: string }): string => {
  const encoded = Object.keys(filters)
    .map(
      (k: string) =>
        encodeURIComponent(`"${k}"`) +
        ":" +
        encodeURIComponent(`"${filters[k]}"`)
    )
    .join(",");
  return `{${encoded}}`;
};

const encodeParams = (params: { [key: string]: string }): string => {
  return Object.keys(params)
    .map(
      (k: string) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k])
    )
    .join("&");
};

const paginate = async (url: string): Promise<StatsDataResponse[]> => {
  let page = await getPage(url);
  const data = page.data;

  while (page.pagination.next !== null) {
    const nextPageURL = `${base_url}${page.pagination.next}`;
    page = await getPage(nextPageURL);
    for (let i = 0; i < page.data.length; i++) {
      data.push(page.data[i]);
    }
  }

  return data;
};

const getPage = async (url: string): Promise<StatsResponse> => {
  if (url in cache) {
    return cache[url];
  }
  const data = await fetch(url).then((response) => {
    if (response.status === 429) {
      throw new Error(
        "It looks like we have made too many requests to get data - please wait a minute before retrying."
      );
    }
    if (response.status >= 300) {
      throw new Error("Error fetching stats from gov.uk");
    }
    if (response.status !== 200) {
      // Return an empty response.
      return {
        data: [],
        length: 0,
        maxPageLimit: 0,
        pagination: {
          current: "unkown",
          first: "unknown",
          last: "unknown",
          next: null,
          previous: null,
        },
      };
    }
    return response.json();
  });
  cache[url] = data;
  return data;
};
