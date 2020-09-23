import moment, { Moment } from "moment"


export interface Stats {
  areaName: string
  date: Moment
  newCases: number
  newCasesRate: number
  newDeaths: number
}

interface RawStats {
  areaName: string
  date: string
  newCases: number
  newCasesRate: number
  newDeaths: number
}
interface StatsResponse {
  data: RawStats[]
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

export const getStats = async (): Promise<Stats[]> => {
  const page = await getPage('https://api.coronavirus.data.gov.uk/v1/data?filters=areaType=region;areaName=South East&structure={"date":"date","areaName":"areaName","newCases":"newCasesBySpecimenDate","newCasesRate":"cumCasesBySpecimenDateRate","newDeaths":"newDeaths28DaysByDeathDate"}')
  const formatted = page.data.map(s => ({ ...s, date: moment(s.date, "YYYY-MM-DD") })).filter(s => s.date <= moment().startOf("day"))
  return formatted
}

const getPage = async (url: string): Promise<StatsResponse> => {
  const r = fetch(url)
    .then(response => response.json())
  return r
}