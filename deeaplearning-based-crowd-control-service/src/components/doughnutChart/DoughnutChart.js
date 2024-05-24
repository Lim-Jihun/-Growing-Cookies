import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ReactApexChart from 'react-apexcharts';

const DoughnutChart = () => {
  // rafce + Enter
  
  const [chartData, setChartData] = useState({
    series: [50],
    options: {
      chart: {
        height: 350,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          hollow: {
            size: '60%',
          }
        },
      },
      colors: ['#66DA26'],
      labels: ['Cricket'],
    },
    title: {
      text: 'undefined',
      align: 'left',
      margin: 10,
      offsetX: 10,
      offsetY: 10,
      floating: true,
      style: {
        fontSize:  '100px',
        fontWeight:  'bold',
        fontFamily:  'Arial',
        color:  '#E91E63'
      },
  }
    
  });
  
  return (
    <div>
      <div id="chart">
        <ReactApexChart options={chartData.options} series={chartData.series} type="radialBar" height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  )
}






export default DoughnutChart;