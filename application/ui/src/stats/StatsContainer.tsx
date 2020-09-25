import React, { useEffect, useState } from 'react';
import { getStats, Stats } from './api';
import StatsComponent from './StatsComponent';


const StatsContainer = () => {
  const [stats, setStats] = useState<Stats[]>([])

  useEffect(() => {
    getStats().then(s => setStats(s))
  }, []);

  return <StatsComponent stats={stats} />
}

export default StatsContainer