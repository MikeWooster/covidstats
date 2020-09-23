import React, { useEffect, useState } from 'react';
import { getStats, Stats } from './api';
import StatsGraph from './StatsGraph';


const StatsContainer = () => {
  const [stats, setStats] = useState<Stats[]>([])

  useEffect(() => {
    getStats().then(s => setStats(s))
  }, []);

  return <StatsGraph stats={stats} />
}

export default StatsContainer