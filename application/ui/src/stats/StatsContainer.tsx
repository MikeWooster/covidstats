import React, { useEffect, useRef, useState } from "react";
import { Segment } from "semantic-ui-react";
import AreaOptionsSelect from "./AreaOptionsSelectComponent";
import AreaRefinementSearch from "./AreaRefinementSearchComponent";
import GraphOptions from "./GraphOptionsComponent";
import PostCodeSearch from "./PostCodeSearchComponent";
import SettingsModal from "./SettingsModal";
import {
  AreaTypes,
  EMPTY_STATS,
  getLoadedStats,
  getLoadedStatsForPostCode,
  getNations,
  getRegions,
  getStats,
  getStatsForPostCode,
  NormalizedStats,
} from "./stats";
import StatsComponent from "./StatsComponent";
import StatsGraph from "./StatsGraph";

const StatsContainer: React.FC<{}> = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<NormalizedStats>(EMPTY_STATS);
  const [areaType, setAreaType] = useState(AreaTypes.overview);
  const [refinedArea, setRefinedArea] = useState("");
  const [searchRadius, setSearchRadius] = useState<number | null>(25);
  const [modalOpen, setModalOpen] = useState(false);

  const [err, setErr] = useState<Error | null>(null);
  const [nations, setNations] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);

  const [applyWeighting, setApplyWeighting] = useState(false);
  const [applyPopulationScaling, setApplyPopulationScaling] = useState(false);

  const postCodeSearchTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const getAndSetStats = (areaType: AreaTypes, refinedArea: string) => {
    setLoading(true);
    setErr(null);
    const statsGetter = false ? getLoadedStats : getStats;
    statsGetter(areaType, refinedArea)
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
    const statsGetter = true ? getLoadedStatsForPostCode : getStatsForPostCode;
    statsGetter(postCode, radius)
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
      setRefinedArea={(v: string) => {
        if (v === "") {
          setStats(EMPTY_STATS);
        }
        setRefinedArea(v);
      }}
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
        setTimer={(v: NodeJS.Timeout | undefined) =>
          (postCodeSearchTimeout.current = v)
        }
        clearTimer={() => {
          if (postCodeSearchTimeout.current !== undefined) {
            clearTimeout(postCodeSearchTimeout.current);
            postCodeSearchTimeout.current = undefined;
          }
        }}
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

  const showApplyWeighting = [AreaTypes.overview, AreaTypes.nation].includes(
    areaType
  );

  const graph = (
    <StatsGraph
      stats={stats}
      displayDeaths={areaType !== AreaTypes.postCode}
      applyWeighting={showApplyWeighting && applyWeighting}
      applyPopulationScaling={applyPopulationScaling}
    />
  );

  const graphOptionsComponent = (
    <GraphOptions
      showApplyWeighting={showApplyWeighting}
      applyWeighting={applyWeighting}
      setApplyWeighting={(v: boolean) => setApplyWeighting(v)}
      applyPopulationScaling={applyPopulationScaling}
      setApplyPopulationScaling={(v: boolean) => setApplyPopulationScaling(v)}
    />
  );

  const settingsModal = (
    <SettingsModal
      setModalOpen={(v: boolean) => setModalOpen(v)}
      modalOpen={modalOpen}
      showApplyWeighting={showApplyWeighting}
      applyWeighting={applyWeighting}
      setApplyWeighting={setApplyWeighting}
      applyPopulationScaling={applyPopulationScaling}
      setApplyPopulationScaling={setApplyPopulationScaling}
    />
  );

  return (
    <StatsComponent
      areaOptions={areaOptionsComponent}
      searchRefinement={searchRefinementComponent}
      graph={graph}
      settingsModal={settingsModal}
      graphOptions={graphOptionsComponent}
      err={errComponent}
      loading={loading}
    />
  );
};

export default StatsContainer;
