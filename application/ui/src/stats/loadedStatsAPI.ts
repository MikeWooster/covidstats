export interface LoadedStatsResponse {
  date: string;
  newCases: number;
  newDeaths: number;
  newTests: number;
}

export interface LoadedResponse {
  areaType: string;
  areaName: string;
  areaCode: string;
  population: number;
  maxTests: number;
  stats: LoadedStatsResponse[];
}

export const fetchLoadedStats = async (
  areaType: string,
  areaName: string
): Promise<LoadedResponse> => {
  const url = `https://covidstats.uk/stats/${areaType}/${areaName}.json`;
  return await fetchURL(url);
};

export const fetchLoadedStatsForLTLAs = async (
  codes: string[]
): Promise<LoadedResponse[]> => {
  const promises = codes.map((code) => {
    const url = `https://covidstats.uk/stats/ltla/${code}.json`;
    return fetchURL(url);
  });
  return await Promise.all(promises);
};

// Simple cache to save repeated lookups.
const cache: { [key: string]: LoadedResponse } = {};

const fetchURL = async (url: string): Promise<LoadedResponse> => {
  if (url in cache) {
    return cache[url];
  }
  const data: LoadedResponse = await fetch(url).then((response) => {
    if (response.status !== 200) {
      // Return an empty response.
      return {
        areaType: "",
        areaName: "",
        areaCode: "",
        population: 0,
        maxTests: 0,
        stats: [],
      };
    }
    return response.json();
  });
  return data;
};
