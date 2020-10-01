import moment from "moment";
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Stats } from "./stats";

interface props {
  stats: Stats[];
  displayDeaths: boolean;
  applyWeighting: boolean;
}

const StatsGraph: React.FC<props> = ({
  stats,
  displayDeaths,
  applyWeighting,
}) => {
  const movingAverage = calcMovingAverage(stats, 7);
  const maxTests = getMaxTests(stats);
  const data = stats.map((s, i) => ({
    ...s,
    date: s.date.toDate().getTime(),
    newCasesMvgAvg: movingAverage[i],
    weightedStats: calcWeightedStats(s, maxTests),
  }));
  return (
    <ResponsiveContainer width="100%" height={600}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          type="number"
          domain={["dataMin", "dataMax"]}
          tickFormatter={tickFormatter}
        />
        <YAxis
          yAxisId="left"
          label={{
            value: "Cases",
            position: "insideLeft",
            angle: -90,
            dy: -20,
          }}
        />
        {displayDeaths && (
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Deaths",
              position: "insideRight",
              angle: 90,
              dy: -20,
            }}
          />
        )}
        <Tooltip
          labelFormatter={(unixTime) => moment(unixTime).format("YYYY-MM-DD")}
        />
        <Legend />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="newCases"
          stroke="#8884d8"
          dot={false}
          name="New Cases"
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="newCasesMvgAvg"
          stroke="#1c074a"
          dot={false}
          name="New Cases (moving average)"
        />
        {displayDeaths && (
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="newDeaths"
            stroke="#dc0000de"
            dot={false}
            name="Deaths"
          />
        )}
        {applyWeighting && (
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="weightedStats"
            stroke="#923f0a"
            strokeWidth={3}
            strokeDasharray={"2 2"}
            dot={false}
            name="Weighted Cases"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

const tickFormatter = (unixTime: number): string => {
  return moment(unixTime).format("YYYY-MM-DD");
};

const calcMovingAverage = (stats: Stats[], days: number): number[] => {
  const movingAverage = [];
  const windowR = days / 2;
  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];
    const minDate = stat.date.clone().subtract(windowR, "d");
    const maxDate = stat.date.clone().add(windowR, "d");

    let sum = 0;
    let count = 0;

    let date = stat.date;
    let j = i;
    while (j >= 0 && date.isSameOrAfter(minDate)) {
      sum += stats[j].newCases;
      date = stats[j].date;
      count++;
      j--;
    }

    date = stat.date;
    let k = i;
    while (k < stats.length && date.isSameOrBefore(maxDate)) {
      sum += stats[k].newCases;
      date = stats[k].date;
      count++;
      k++;
    }
    movingAverage.push(sum / count);
  }
  return movingAverage;
};

const getMaxTests = (stats: Stats[]): number | null => {
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

const calcWeightedStats = (
  stat: Stats,
  maxTests: number | null
): number | null => {
  if (maxTests === null || stat.newTests === null) {
    // unable to apply any weighting
    return null;
  }
  const ratio = maxTests / stat.newTests;
  return stat.newCases * ratio;
};

export default StatsGraph;
