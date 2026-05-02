import useReactApexChart from "../../hook/useReactApexChart";
import ReactApexChart from "react-apexcharts";

const FeeReportChart = () => {
  let { lineDataLabelSeries, lineDataLabelOptions } = useReactApexChart();
  return (
    <div className='col-md-12'>
      <div className='card h-100 p-0 mt-5'>
        <div className='card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between flex-wrap gap-2'>
          <h6 className='text-lg fw-semibold mb-0'>Fee Report</h6>
          <h6 className='text-md fw-medium text-secondary-light mb-0'>
            Last 7 Days Fee Report
          </h6>
        </div>
        <div className='card-body p-24'>
          <ReactApexChart
            id='lineDataLabel'
            options={lineDataLabelOptions}
            series={lineDataLabelSeries}
            type='line'
            height={264}
          />
        </div>
      </div>
    </div>
  );
};

export default FeeReportChart;
