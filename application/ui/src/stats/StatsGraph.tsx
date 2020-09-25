import moment from 'moment';
import React from 'react';
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { Stats } from './api';


const StatsGraph = ({ stats }: { stats: Stats[] }) => {
  const movingAverage = calcMovingAverage(stats, 7)
  const data = stats.map((s, i) => ({ ...s, "date": s.date.toDate().getTime(), newCasesMvgAvg: movingAverage[i] }))
  return (
    <LineChart
      width={1000}
      height={600}
      data={data}
    // margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" type="number" domain={['dataMin', 'dataMax']} tickFormatter={tickFormatter} />
      <YAxis />
      <Tooltip labelFormatter={(unixTime) => moment(unixTime).format('YYYY-MM-DD')} />
      <Line type="monotone" dataKey="newCases" stroke="#8884d8" dot={false} />
      <Line type="monotone" dataKey="newCasesMvgAvg" stroke="#1c074a" dot={false} />
    </LineChart>
  )

}

const tickFormatter = (unixTime: number): string => {
  return moment(unixTime).format('YYYY-MM-DD')
}

const calcMovingAverage = (stats: Stats[], days: number): number[] => {
  const movingAverage = []
  const windowR = days / 2
  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i]
    const minDate = stat.date.clone().subtract(windowR, "d")
    const maxDate = stat.date.clone().add(windowR, "d")

    let sum = 0
    let count = 0

    let date = stat.date
    let j = i;
    while (j >= 0 && date.isSameOrAfter(minDate)) {
      sum += stats[j].newCases
      date = stats[j].date
      count++
      j--
    }

    date = stat.date
    let k = i;
    while (k < stats.length && date.isSameOrBefore(maxDate)) {
      sum += stats[k].newCases
      date = stats[k].date
      count++
      k++
    }
    movingAverage.push(sum / count)
  }
  return movingAverage
}

export default StatsGraph
