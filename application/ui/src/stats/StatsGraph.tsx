import moment, { Moment } from "moment";
import React from "react";
import {
  Bar,
  Brush,
  CartesianGrid,
  ComposedChart,
  Label,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { hexToRgb, rgbToHex } from "../utils/colours";
import { nullToZero } from "../utils/math";
import { NormalizedStats, removeDays } from "./stats";

interface props {
  initialStats: NormalizedStats;
  displayDeaths: boolean;
  applyWeighting: boolean;
  applyPopulationScaling: boolean;
  displayDeathsMovingAverage: boolean;
  daysToDisregard: number | null;
}

const StatsGraph: React.FC<props> = ({
  initialStats,
  displayDeaths,
  applyWeighting,
  applyPopulationScaling,
  displayDeathsMovingAverage,
  daysToDisregard,
}) => {
  const winWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const onMobile = winWidth < 800;

  const stats = removeDays(initialStats, daysToDisregard);

  const population = stats.areas
    .map((area) => area.population)
    .reduce((a, b) => a + b, 0);

  const statsMovingAv = applyPopulationScaling
    ? calcMovingAverage(
        stats.dates.map((date) => ({
          date: date.asMoment,
          val: scaleByPopulation(date.totals.totalCases, population, 1),
        })),
        7
      )
    : calcMovingAverage(
        stats.dates.map((date) => ({
          date: date.asMoment,
          val: date.totals.totalCases,
        })),
        7
      );
  const deathsMovingAv = applyPopulationScaling
    ? calcMovingAverage(
        stats.dates.map((date) => ({
          date: date.asMoment,
          val: scaleByPopulation(date.totals.totalDeaths, population, 1),
        })),
        7
      )
    : calcMovingAverage(
        stats.dates.map((date) => ({
          date: date.asMoment,
          val: date.totals.totalDeaths,
        })),
        7
      );

  // Sum up the total number of tests taken in all areas
  const maxTests = stats.areas
    .map((area) => area.maxTests)
    .reduce((a, b) => nullToZero(a) + nullToZero(b), 0);

  const data: {
    date: number;
    [key: string]: number | null;
  }[] = stats.dates.map((date, i) => {
    const input: { [key: string]: number | null } = {};
    input.casesMA = statsMovingAv[i];
    input.deathsMA = deathsMovingAv[i];

    const weightedInput = calcWeightedStat(
      date.totals.totalCases,
      date.totals.totalTests,
      maxTests
    );
    input.weightedCases = applyPopulationScaling
      ? scaleByPopulation(weightedInput, population, 1)
      : weightedInput;

    for (let i = 0; i < stats.areas.length; i++) {
      const area = stats.areas[i];
      const key = `${date.asString}-${area.areaCode}`;
      if (!(key in stats.stats)) {
        continue;
      }
      const casesKey = `${area.areaCode}Cases`;
      const deathsKey = `${area.areaCode}Deaths`;

      input[casesKey] = applyPopulationScaling
        ? scaleByPopulation(
            stats.stats[key].newCases,
            area.population,
            area.population / population
          )
        : stats.stats[key].newCases;
      input[deathsKey] = applyPopulationScaling
        ? scaleByPopulation(
            stats.stats[key].newDeaths,
            area.population,
            area.population / population
          )
        : stats.stats[key].newDeaths;
    }
    return {
      date: date.asMoment.toDate().getTime(),
      ...input,
    };
  });

  const numLatestCases = stats.areas
    .map((area) => {
      const casesKey = `${area.areaCode}Cases`;
      return data[data.length - 1][casesKey];
    })
    .reduce((a, b) => nullToZero(a) + nullToZero(b), 0);
  const lastDate = stats.dates[stats.dates.length - 1]?.asString;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          type="number"
          domain={["dataMin", "dataMax"]}
          scale="linear"
          tickFormatter={tickFormatter}
        />
        <YAxis
          hide={onMobile}
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
            hide={onMobile}
            yAxisId="right"
            orientation="right"
            label={{
              value: applyPopulationScaling ? "Deaths per 100,000" : "Deaths",
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
        {stats.areas.map((area, i) => {
          const colour = selectColour(
            i,
            stats.areas.length,
            "#cec0ec",
            "#1b034e"
          );
          return (
            <Bar
              key={`${area.areaCode}Cases`}
              yAxisId="left"
              dataKey={`${area.areaCode}Cases`}
              stroke={colour}
              fill={colour}
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
          !displayDeathsMovingAverage &&
          stats.areas.map((area) => (
            <Line
              key={`${area.areaCode}Deaths`}
              yAxisId="right"
              type="monotone"
              dataKey={`${area.areaCode}Deaths`}
              stroke="#dc0000de"
              dot={false}
              name={`${area.areaName} (Deaths)`}
              strokeWidth="2"
            />
          ))}
        {displayDeaths && displayDeathsMovingAverage && (
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={"deathsMA"}
            stroke="#dc0000de"
            dot={false}
            name="Moving Average (Deaths)"
            strokeWidth="2"
          />
        )}
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
        {numLatestCases && numLatestCases > 0 && (
          <ReferenceLine
            yAxisId="left"
            y={numLatestCases}
            isFront={true}
            stroke="red"
            strokeDasharray="3 3"
          >
            <Label position="top" fill={"red"}>
              {`Latest (${lastDate}): ${numLatestCases}`}
            </Label>
          </ReferenceLine>
        )}
        <Brush dataKey="date" tickFormatter={tickFormatter}>
          <LineChart compact={false}>
            <CartesianGrid strokeDasharray="0 0" />
            <XAxis
              dataKey="date"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              hide={true}
            />
            <YAxis domain={["auto", "auto"]} hide={true} />
            <Line
              type="monotone"
              dataKey={"casesMA"}
              stroke="#1c074a"
              dot={false}
              strokeWidth="2"
            />
          </LineChart>
        </Brush>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

const selectColour = (
  i: number,
  total: number,
  startColour: string,
  endColour: string
): string => {
  const factor = i / total;
  return interpolateColor(startColour, endColour, factor);
};

const interpolateColor = (
  startColour: string,
  endColour: string,
  factor: number
): string => {
  const { r: r1, g: g1, b: b1 } = hexToRgb(startColour);
  const { r: r2, g: g2, b: b2 } = hexToRgb(endColour);

  const r3 = Math.round(r1 + factor * (r2 - r1));
  const g3 = Math.round(g1 + factor * (g2 - g1));
  const b3 = Math.round(b1 + factor * (b2 - b1));
  return rgbToHex(r3, g3, b3);
};

const tickFormatter = (unixTime: number): string => {
  return moment(unixTime).format("YYYY-MM-DD");
};

const calcMovingAverage = (
  stats: { date: Moment; val: number | null }[],
  days: number
): (number | null)[] => {
  const movingAverage: (number | null)[] = [];
  if (stats.length === 0) {
    return movingAverage;
  }
  const windowR = days / 2;
  const firstDate = stats[0].date;
  const lastDate = stats[stats.length - 1].date;

  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];
    const minDate = stat.date.clone().subtract(windowR, "d");
    const maxDate = stat.date.clone().add(windowR, "d");

    // Ensure the moving average only accounts for dates that have
    // available data in the window.
    if (minDate.isBefore(firstDate) || maxDate.isAfter(lastDate)) {
      movingAverage.push(null);
      continue;
    }
    let sum = 0;
    let count = 0;

    let date = stat.date;
    let j = i;
    while (j >= 0 && date.isSameOrAfter(minDate)) {
      sum += stats[j].val || 0;
      date = stats[j].date;
      count++;
      j--;
    }

    date = stat.date;
    let k = i;
    while (k < stats.length && date.isSameOrBefore(maxDate)) {
      sum += stats[k].val || 0;
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
  population: number,
  scalingRatio: number
): number | null => {
  if (v === null || population === 0) {
    return null;
  }
  return ((100000 * v) / population) * scalingRatio;
};

export default StatsGraph;
