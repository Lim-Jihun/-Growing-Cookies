import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ReactApexChart from 'react-apexcharts';

const DoughnutChart = ({color}) => {
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
          },
          dataLabels: {
            name: {
              show: true,
              
              
            },
            value: {
              show: true,
              fontSize: '30px',
              formatter: function (val) {
                return val + '%'
              }
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '30px'
            }
          }
        },
      },
      colors: [color],
      labels: ['Cricket'],
    },
    
    
  });
  
  return (
    <div>
      <div id="dchart1">
        <ReactApexChart options={chartData.options} series={chartData.series} type="radialBar" height={350} />
      </div>
      <div id="html-dist1"></div>
    </div>
  )
}






export default DoughnutChart;
