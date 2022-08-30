import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { Helmet } from "react-helmet-async";

interface IHistorical {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

function Chart() {
  const { coinId } = useParams();
  const { isLoading, data } = useQuery<IHistorical[]>(["ohlcv", coinId], () =>
    fetchCoinHistory(coinId)
  );
  return (
    <>
      <Helmet>
        <title>Chart</title>
      </Helmet>
      <div>
        {isLoading ? (
          "Loading chart..."
        ) : (
          <ApexChart
            type="line"
            series={[
              {
                name: "price",
                data: data?.map((price) => Number(price.close)) as number[],
              },
            ]}
            options={{
              theme: {
                mode: "dark",
              },
              chart: {
                height: 300,
                width: 500,
                toolbar: {
                  show: false,
                },
                background: "transparent",
              },
              grid: { show: false },
              stroke: {
                curve: "smooth",
                width: 3,
              },
              yaxis: {
                show: false,
              },
              xaxis: {
                axisBorder: { show: false },
                axisTicks: { show: false },
                labels: { show: false },
                type: "datetime",
                categories: data?.map(
                  (price) => price.time_close * 1000
                ) as number[],
              },
              fill: {
                type: "gradient",
                gradient: { gradientToColors: ["#42f5ad"], stops: [0, 100] },
              },
              colors: ["#f3ffad"],
              tooltip: {
                y: {
                  formatter: (value) => `$ ${value.toFixed(3)}`,
                },
              },
            }}
          />
        )}
      </div>
    </>
  );
}

export default Chart;
