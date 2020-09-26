import moment from "moment";
import { Moment } from "moment";
import { fetchAllStatsForDate, fetchStats, StatsData } from "./api";


export enum AreaTypes {
  overview = "overview",
  nation = "nation",
  region = "region",
}
export interface Stats {
  date: Moment
  newCases: number
}

export const getNations = async (): Promise<string[]> => {
  return Promise.resolve([
    "England",
    "Northern Ireland",
    "Scotland",
    "Wales",
  ])
}

export const getRegions = async (): Promise<string[]> => {
  const data = await fetchAllStatsForDate("2020-09-01")
  const regions = data
    .filter(p => p.areaType === AreaTypes.region)
    .map(p => p.areaName)
  return regions
}

export const getStats = async (areaType: AreaTypes, refinedArea: string): Promise<Stats[]> => {
  let data: StatsData[] = []
  if (areaType === AreaTypes.overview) {
    data = await fetchStats(areaType, "")
  }
  else if (refinedArea === "") {
    data = []
  }
  else {
    data = await fetchStats(areaType, refinedArea)
  }
  const formatted = data.map(s => ({ ...s, date: moment(s.date, "YYYY-MM-DD") })).filter(s => s.date <= moment().startOf("day"))
  return formatted.sort((a, b) => (a.date.isBefore(b.date) ? -1 : 1))
}

