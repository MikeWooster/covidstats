import { AreaTypes } from "./stats"

export interface StatsData {
  areaType: string
  areaName: string
  date: string
  newCases: number
  newCasesRate: number
  newDeaths: number
}
interface StatsResponse {
  data: StatsData[]
  length: number
  maxPageLimit: number
  pagination: {
    current: string
    first: string
    last: string
    next: string | null
    previous: string | null
  },
}

// // Get for regional data:
// export const getStats = async (): Promise<Stats[]> => {
//   const page = await getPage('https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=region;areaName=South East&structure={"date":"date","areaName":"areaName","newCases":"newCasesBySpecimenDate","newCasesRate":"cumCasesBySpecimenDateRate","newDeaths":"newDeaths28DaysByDeathDate"}')
//   const formatted = page.data.map(s => ({ ...s, date: moment(s.date, "YYYY-MM-DD") })).filter(s => s.date <= moment().startOf("day"))
//   return formatted.sort((a, b) => (a.date.isBefore(b.date) ? -1 : 1))
// }


export const fetchAllStatsForDate = async (date: string): Promise<StatsData[]> => {
  const filters: { [key: string]: string } = {
    date: date,
  }
  const structure = {
    date: "date",
    areaType: "areaType",
    areaName: "areaName",
  }

  const url = buildURL(filters, structure)
  return await paginate(url)
}

export const fetchStats = async (areaType: string, areaName: string): Promise<StatsData[]> => {
  const filters: { [key: string]: string } = {
    areaType: areaType,
  }
  const structure = {
    date: "date",
    areaType: "areaType",
    areaName: "areaName",
    newCases: "newCasesBySpecimenDate",
    newCasesRate: "cumCasesBySpecimenDateRate",
    newDeaths: "newDeaths28DaysByDeathDate"
  }

  if (areaType !== AreaTypes.overview) {
    filters.areaName = areaName
  }

  const url = buildURL(filters, structure)
  return await paginate(url)
}

const buildURL = (filters: { [key: string]: string }, structure: { [key: string]: string }): string => {
  const params = encodeParams({
    filters: encodeFilters(filters),
    structure: encodeStructure(structure)
  })
  return `https://api.coronavirus.data.gov.uk/v1/data?${params}`
}

const encodeFilters = (filters: { [key: string]: string }): string => {
  return Object.keys(filters)
    .map((k: string) => encodeURIComponent(k) + "=" + encodeURIComponent(filters[k]))
    .join(";")
}

const encodeStructure = (filters: { [key: string]: string }): string => {
  const encoded = Object.keys(filters)
    .map((k: string) => encodeURIComponent(`"${k}"`) + ":" + encodeURIComponent(`"${filters[k]}"`))
    .join(",")
  return `{${encoded}}`
}

const encodeParams = (params: { [key: string]: string }): string => {
  return Object.keys(params)
    .map((k: string) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&")
}

const paginate = async (url: string): Promise<StatsData[]> => {
  let page = await getPage(url);
  const data = page.data

  while (page.pagination.next !== null) {
    page = await getPage(page.pagination.next)
    for (let i = 0; i < page.data.length; i++) {
      data.push(page.data[i])
    }
  }

  return data
}

const getPage = async (url: string): Promise<StatsResponse> => {
  const r = fetch(url)
    .then(response => response.json())
  return r
}