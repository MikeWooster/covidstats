import React from "react";
import { NormalizedStats } from "./stats";
import { Message, Popup } from "semantic-ui-react";
import { calculateCasesRatio } from "../utils/alerts";

interface props {
  stats: NormalizedStats;
  daysToDisregard: number | null
}

/*
  AlertComponent: Takes the last 14 days of valid stats (disregarding the days
  to ignore, and computes the total number of people that currently have
  contracted Covid against the current population of the area.  This will provide
  a percentage of people that currently have covid.
  Very High: > 1 in 100 people have covid - you might contract it if you go out for a walk.
  High: > 1 in 300 people have covid - you might contract it if you go to the supermarket.
  Medium: > 1 in 1,000 people have covid - you might contract it if you go to a concert.
  Low: > 1 in 10,000 people have covid - you might contract it if you attend a very large event.
 */
const AlertComponent: React.FC<props> = ({ stats, daysToDisregard }) => {
  const totalActiveCases = calculateCasesRatio(stats, 14, daysToDisregard || 0);
  const alert = getAlert(totalActiveCases.casesRatio);
  return <Popup trigger={alert} position={"bottom left"}>
    <div>
      <h4>1 in {Math.round(totalActiveCases.casesRatio)} people are considered to have Covid in the search area.</h4>
      <p>
        <ul>
          <li>Population: {totalActiveCases.population.toLocaleString()}</li>
          <li>Total Cases: {totalActiveCases.activeCases.toLocaleString()}</li>
        </ul>
      </p>
      <p>
        The following criteria have been considered to construct the alert categories:
        <ul>
          <li>
            Very High: Greater than 1 in 100 people have covid in the last 14 days. This is the approx number of
            people you may pass on a typical walk near a town.
          </li>
          <li>
            High: Greater than 1 in 300 people have Covid in the last 14 days. This is the approx number of people you
            might pass when you visit a supermarket.
          </li>
          <li>
            Medium: Greater than 1 in 1,000 people have Covid in the last 14 days. This is the approx number of people
            you may be exposed to at a small/medium club/bar on a night out.
          </li>
          <li>
            Low: Greater than 1 in 10,000 people have Covid in the last 14 days. This is the approx number of people you
            may be exposed to at a large social event, e.g. a concert.
          </li>
        </ul>
      </p>
    </div>
  </Popup>;
};

const getAlert = (casesRatio: number): React.ReactElement => {
  const style = { textAlign: "center", paddingLeft: 0, paddingRight: 0 };
  if (casesRatio === 0) {
    return <div></div>;
  } else if (casesRatio <= 100) {
    return <Message style={style} error>Alert: Very High</Message>;
  } else if (casesRatio <= 300) {
    return <Message style={style} error>Alert: High</Message>;
  } else if (casesRatio <= 1000) {
    return <Message style={style} warning>Alert: Medium</Message>;
  }
  return <Message style={style} info>Alert: Low</Message>;
};

export default AlertComponent;