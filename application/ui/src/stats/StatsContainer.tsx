import React, { useEffect, useState } from 'react';
import { useUnsafeEffect } from '../hooks';
import { AreaTypes, getNations, getRegions, getStats, Stats } from './stats';
import StatsComponent from './StatsComponent';

const StatsContainer = () => {
  const [stats, setStats] = useState<Stats[]>([])
  const [areaType, setAreaType] = useState(AreaTypes.overview)
  const [refinedArea, setRefinedArea] = useState("")
  const [err, setErr] = useState("")
  const [nations, setNations] = useState<string[]>([])
  const [regions, setRegions] = useState<string[]>([])

  useUnsafeEffect(() => {
    getNations()
      .then(n => setNations(n))
      .catch(err => setErr(err))
    getRegions()
      .then(r => setRegions(r))
      .catch(err => setErr(err))
  }, [])

  // Make sure a refined area is selected when the area type changes
  useEffect(() => {
    switch (areaType) {
      case AreaTypes.overview:
        setRefinedArea("")
        break;
      case AreaTypes.nation:
        setRefinedArea(nations.length > 0 ? nations[0] : "")
        break;
      case AreaTypes.region:
        setRefinedArea(regions.length > 0 ? regions[0] : "")
        break;
    }
  }, [areaType, nations, regions])

  useUnsafeEffect(() => {
    getStats(areaType, refinedArea)
      .then(s => setStats(s))
      .catch(err => setErr(err))
  }, [refinedArea]);

  return <StatsComponent
    err={err}
    nations={nations}
    regions={regions}
    stats={stats}
    areaType={areaType}
    setAreaType={(v: AreaTypes) => setAreaType(v)}
    refinedArea={refinedArea}
    setRefinedArea={(v: string) => setRefinedArea(v)}
  />
}

export default StatsContainer