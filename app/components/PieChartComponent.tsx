import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  connectToMQTT,
  subscribeToTopic,
  unsubscribeFromTopic,
} from "../../utils/mqttClient";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface FuelUsageData {
  name: string;
  usage: number;
}

const PieChartComponent = () => {
  const [data, setData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  }>({ labels: [], datasets: [] });

  useEffect(() => {
    connectToMQTT();

    const handleData = (msg: string) => {
      const result: FuelUsageData[] = JSON.parse(msg);
      const labels = result.map((item) => item.name);
      const volumes = result.map((item) => item.usage);

      setData({
        labels: labels,
        datasets: [
          {
            label: "Usage",
            data: volumes,
            backgroundColor: [
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(201, 203, 207, 0.2)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(201, 203, 207, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
    };

    subscribeToTopic("test/fuel-usage", handleData);
    return () => {
      unsubscribeFromTopic("test/fuel-usage", handleData);
    };
  }, []);

  return (
    <div className=" border rounded-lg p-4 w-full h-full">
      <h2 className="text-center">FUEL USAGE THIS MONTH</h2>
      <div>
        <Pie
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top" },
            },
          }}
        />
      </div>
    </div>
  );
};

export default PieChartComponent;
