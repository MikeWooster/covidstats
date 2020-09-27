import React, { useEffect, useRef, useState } from "react";
import { Segment } from "semantic-ui-react";
import {
  AreaTypes,
  getNations,
  getRegions,
  getStats,
  getStatsForPostCode,
  Stats,
} from "./stats";
import StatsComponent, {
  AreaOptionsSelect,
  AreaRefinementSearch,
  PostCodeSearch,
} from "./StatsComponent";
import StatsGraph from "./StatsGraph";

const StatsContainer = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats[]>([]);
  const [areaType, setAreaType] = useState(AreaTypes.overview);
  const [refinedArea, setRefinedArea] = useState("");
  const [searchRadius, setSearchRadius] = useState<number | null>(25);

  const [err, setErr] = useState<Error | null>(null);
  const [nations, setNations] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);

  const postCodeSearchTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const getAndSetStats = (areaType: AreaTypes, refinedArea: string) => {
    setLoading(true);
    setErr(null);
    getStats(areaType, refinedArea)
      .then((stats) => {
        setLoading(false);
        setStats(stats);
      })
      .catch((err) => {
        setErr(err);
        setLoading(false);
      });
  };

  const getAndSetStatsForPostCode = (postCode: string, radius: number) => {
    setErr(null);
    if (postCode === "") {
      return;
    }
    setLoading(true);
    getStatsForPostCode(postCode, radius)
      .then((stats) => {
        setLoading(false);
        setStats(stats);
      })
      .catch((err) => {
        setErr(err);
        setLoading(false);
      });
  };

  const errComponent = err ? (
    <Segment inverted color="red" tertiary>
      {err.message}
    </Segment>
  ) : null;

  useEffect(() => {
    getAndSetStats(AreaTypes.overview, "");
    getNations().then((nations) => setNations(nations));
    getRegions().then((regions) => setRegions(regions));
  }, []);

  const areaOptionsComponent = (
    <AreaOptionsSelect
      areaType={areaType}
      setAreaType={setAreaType}
      getStats={getAndSetStats}
      nations={nations}
      regions={regions}
      setRefinedArea={setRefinedArea}
    />
  );
  const searchRefinementComponent =
    areaType === AreaTypes.postCode ? (
      <PostCodeSearch
        postCode={refinedArea}
        setRefinedArea={setRefinedArea}
        searchRadius={searchRadius}
        setSearchRadius={setSearchRadius}
        getStatsForPostCode={getAndSetStatsForPostCode}
        searchTimeout={postCodeSearchTimeout}
        loading={loading}
      />
    ) : (
      <AreaRefinementSearch
        nations={nations}
        regions={regions}
        areaType={areaType}
        refinedArea={refinedArea}
        setRefinedArea={setRefinedArea}
        getStats={getAndSetStats}
      />
    );

  const graph = <StatsGraph stats={stats} />;

  return (
    <StatsComponent
      areaOptions={areaOptionsComponent}
      searchRefinement={searchRefinementComponent}
      graph={graph}
      err={errComponent}
    />
  );
};

export default StatsContainer;
