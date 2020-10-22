import React from "react";
import { loadSettings } from "./settings";
import StatsContainer from "./stats/StatsContainer";

const App = () => {
  const settings = loadSettings();

  return (
    <div>
      <StatsContainer settings={settings} />
    </div>
  );
};

export default App;
