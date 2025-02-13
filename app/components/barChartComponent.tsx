import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  connectToMQTT,
  subscribeToTopic,
  unsubscribeFromTopic,
} from "../../utils/mqttClient";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CarUsageData {
  name: string;
  usage: number;
}

const BarChartComponent = () => {
  const [data, setData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  }>({ labels: [], datasets: [] });

  useEffect(() => {
    connectToMQTT();

    const handleData = (msg: string) => {
      const result: CarUsageData[] = JSON.parse(msg);
      const labels = result.map((item) => item.name);
      const usage = result.map((item) => item.usage);

      setData({
        labels: labels,
        datasets: [
          {
            label: "Usage",
            data: usage,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    };

    subscribeToTopic("test/top-5-car-usage", handleData);
    return () => {
      unsubscribeFromTopic("test/top-5-car-usage", handleData);
    };
  }, []);

  return (
    <div className="w-full border rounded-lg p-4">
      <h2 className="text-center">TOP 5 CAR USAGE THIS MONTH</h2>
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
          },
        }}
      />
    </div>
  );
};

export default BarChartComponent;
