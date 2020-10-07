import moment, { Moment } from "moment";
import React from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { nullToZero } from "../utils/math";
import { NormalizedStats, Stat } from "./stats";

interface props {
  stats: NormalizedStats;
  displayDeaths: boolean;
  applyWeighting: boolean;
  applyPopulationScaling: boolean;
}

const StatsGraph: React.FC<props> = ({
  stats,
  displayDeaths,
  applyWeighting,
  applyPopulationScaling,
}) => {
  const movingAverage = calcMovingAverage(
    stats.dates.map((date) => ({
      date: date.asMoment,
      val: date.totals.totalCases,
    })),
    7
  );
  // Sum up the total number of tests taken in all areas
  const maxTests = stats.areas
    .map((area) => area.maxTests)
    .reduce((a, b) => nullToZero(a) + nullToZero(b), 0);

  const data = stats.dates.map((date, i) => {
    const input: { [key: string]: number | null } = {};
    input.casesMA = movingAverage[i];
    input.weightedCases = calcWeightedStat(
      date.totals.totalCases,
      date.totals.totalTests,
      maxTests
    );

    for (let i = 0; i < stats.areas.length; i++) {
      const area = stats.areas[i];
      const key = `${date.asString}-${area.areaCode}`;

      const casesKey = `${area.areaCode}Cases`;
      const deathsKey = `${area.areaCode}Deaths`;

      input[casesKey] = stats.stats[key].newCases;
      input[deathsKey] = stats.stats[key].newDeaths;
    }
    return {
      date: date.asMoment.toDate().getTime(),
      ...input,
    };
  });
  console.log(data);

  // const movingAverage = calcMovingAverage(stats, (s: Stats) => s.newCases, 7);
  // const movingAvPopScaled = calcMovingAverage(
  //   stats,
  //   (s: Stats) => scaleByPopulation(s.newCases, population) || 0,
  //   7
  // );

  // const data = stats.map((s, i) => ({
  //   ...s,
  //   date: s.date.toDate().getTime(),
  //   newCasesMvgAvg: movingAverage[i],
  //   weightedStats: calcWeightedStats(s, maxTests),
  //   populationScaledCases: scaleByPopulation(s.newCases, population),
  //   populationScaledCasesMvgAvg: movingAvPopScaled[i],
  // }));

  return (
    <ResponsiveContainer width="100%" height={600}>
      <ComposedChart
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
            value: applyPopulationScaling ? "Cases per 100,000" : "Cases",
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
        {stats.areas.map((area) => {
          const colour = randomColour();
          return (
            <Area
              key={`${area.areaCode}Cases`}
              yAxisId="left"
              type="monotone"
              dataKey={`${area.areaCode}Cases`}
              stroke={colour}
              fill={colour}
              dot={false}
              name={`${area.areaName} (Cases)`}
              stackId="1"
            />
          );
        })}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey={"casesMA"}
          stroke="#1c074a"
          dot={false}
          name="Moving Average (Cases)"
          strokeWidth="2"
        />
        )
        {displayDeaths &&
          stats.areas.map((area) => (
            <Line
              key={`${area.areaCode}Deaths`}
              yAxisId="right"
              type="monotone"
              dataKey={`${area.areaCode}Deaths`}
              stroke="#dc0000de"
              dot={false}
              name={`${area.areaName} (Deaths)`}
            />
          ))}
        {applyWeighting && (
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="weightedCases"
            stroke="#923f0a"
            strokeWidth={3}
            strokeDasharray={"2 2"}
            dot={false}
            name="Weighted Cases"
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const randomColour = (): string => {
  const val = Math.floor(Math.random() * 16777215).toString(16);
  return `#${val}`;
};

const tickFormatter = (unixTime: number): string => {
  return moment(unixTime).format("YYYY-MM-DD");
};

const calcMovingAverage = (
  stats: { date: Moment; val: number }[],
  days: number
): number[] => {
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
      sum += stats[j].val;
      date = stats[j].date;
      count++;
      j--;
    }

    date = stat.date;
    let k = i;
    while (k < stats.length && date.isSameOrBefore(maxDate)) {
      sum += stats[k].val;
      date = stats[k].date;
      count++;
      k++;
    }
    movingAverage.push(sum / count);
  }
  return movingAverage;
};

const calcWeightedStat = (
  val: number,
  tests: number | null,
  maxTests: number | null
): number | null => {
  if (maxTests === null || tests === null || tests === 0) {
    // unable to apply any weighting
    return null;
  }
  const ratio = maxTests / tests;
  return val * ratio;
};

// scaleByPopulation takes the number and applies a scaling to
// give the number of X per 100,000.
const scaleByPopulation = (
  v: number | null,
  population: number | null
): number | null => {
  if (v === null || population === null) {
    return null;
  }
  return (100000 * v) / population;
};

export default StatsGraph;
