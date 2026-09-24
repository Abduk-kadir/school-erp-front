import { Icon } from "@iconify/react";
import useReactApexChart from "../../hook/useReactApexChart";
import ReactApexChart from "react-apexcharts";

const FeeReportChart = ({ title,categories,data,seriesName }) => {
  let { lineDataLabelSeries, lineDataLabelOptions } = useReactApexChart();
  const series = [
    {
      name: seriesName,
      data: data, // e.g. [1200, 800, 1500, 900, 1100, 700, 1300]
    },
  ];
  const options = {
    ...lineDataLabelOptions,
    xaxis: {
      ...lineDataLabelOptions.xaxis,
      categories: categories, // e.g. ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
    },
    yaxis: {
      ...lineDataLabelOptions.yaxis,
      labels: {
        ...lineDataLabelOptions.yaxis?.labels,
        formatter: (value) => `₹${value}`,
      },
    },
  };
  return (
    <div className='col-md-6 adm-chart-col'>
      <div className='chfi-card'>
        <div className='card-header'>
          <div className='header-row'>
            <span className='header-icon'>
              <Icon icon='fa6-solid:indian-rupee-sign' width='14' />
            </span>
            <div>
              <h5 className='card-title'>{title}</h5>
            </div>
          </div>
        </div>
        <div className='card-body'>
          <ReactApexChart
           
            options={options}
            series={series}
            type='line'
            height={264}
          />
        </div>
      </div>
    </div>
  );
};

export default FeeReportChart;
