import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Stats } from './api';

const StatsGraph = ({ stats }: { stats: Stats[] }) => {
  const series = [{
    name: "New Cases",
    data: stats.map(s => [s.date.toDate(), s.newCases])
  }]
  const options = {
    chart: {
      height: 350,
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    title: {
      text: 'New Cases By Day',
      align: 'left'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    xaxis: {
      type: "datetime"
    }

  }

  return <ReactApexChart options={options} series={series} type="area" height={350} />
}

export default StatsGraph
