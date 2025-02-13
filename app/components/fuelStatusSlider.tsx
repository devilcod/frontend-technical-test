import Image from "next/image";
import {
  connectToMQTT,
  subscribeToTopic,
  unsubscribeFromTopic,
} from "../../utils/mqttClient";
import { useEffect, useState } from "react";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import BarChartComponent from "./barChartComponent";
import PieChartComponent from "./PieChartComponent";

interface FuelData {
  current_stock: number;
  maxium_stock: number;
  name: string;
  status: string;
  updated_at: string;
}

const FuelStatusSlider = () => {
  const [data, setData] = useState<FuelData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    connectToMQTT();
    const handleData = (msg: string) => {
      try {
        const result: FuelData[] = JSON.parse(msg);
        setData(result);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    };

    subscribeToTopic("test/realtime", handleData);
    return () => {
      unsubscribeFromTopic("test/realtime", handleData);
    };
  }, []);

  const getMinutesDifference = (updatedAt: string) => {
    const now = new Date();
    const updatedAtDate = new Date(updatedAt);
    const differenceInMilliseconds = now.getTime() - updatedAtDate.getTime();
    return Math.floor(differenceInMilliseconds / 60000);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, data.length - 1));
  };

  return (
    <div className=" flex flex-col gap-8">
      <div className="flex flex-col w-full ">
        <p className=" text-2xl font-bold text-center my-8">
          REALTIME FUEL TANK STATUS
        </p>
        <div className="flex justify-center gap-8">
          <button onClick={handlePrev}>
            <FaArrowCircleLeft size={24} />
          </button>
          <div className="flex gap-[1%] w-[90%] max-w-[90%] overflow-x-hidden bg-[#0c0d21] p-4 rounded-md">
            {Array.isArray(data) && data.length > 0 ? (
              data.map((arr, index) => (
                <div
                  key={index}
                  className="flex border-2 min-w-[33%] p-4 rounded-md transition-transform duration-300"
                  style={{
                    transform: `translateX(-${currentIndex * 104}%)`,
                    backgroundColor:
                      arr.current_stock / arr.maxium_stock >= 0.6
                        ? "#0b8d00"
                        : arr.current_stock / arr.maxium_stock >= 0.2
                        ? "#c98502"
                        : "#8d0000",
                  }}
                >
                  <div className="flex h-full w-auto bg-[#1b213b] p-4 rounded-md">
                    <div className="flex items-end justify-center relative bg-gray-500 h-full min-w-6 rounded-lg overflow-hidden">
                      <div
                        className="min-w-6"
                        style={{
                          height: `${
                            (arr.current_stock / arr.maxium_stock) * 100
                          }%`,
                          backgroundColor:
                            arr.current_stock / arr.maxium_stock >= 0.6
                              ? "#0b8d00"
                              : arr.current_stock / arr.maxium_stock < 0.6 &&
                                arr.current_stock / arr.maxium_stock >= 0.2
                              ? "#c98502"
                              : "#8d0000",
                        }}
                      ></div>
                      <p className="text-[10px] absolute top-2">
                        {(arr.current_stock / arr.maxium_stock) * 100}%
                      </p>
                    </div>
                    <Image
                      src="/oil-barrel.png"
                      alt=""
                      height={100}
                      width={100}
                    />
                  </div>
                  <div className="flex flex-col justify-between items-start">
                    <div className="flex justify-between">
                      <div className="pl-2">
                        <p className="font-semibold text-lg">{arr.name}</p>
                        <p className="font-medium text-base">
                          {arr.current_stock} / {arr.maxium_stock} L
                        </p>
                      </div>
                      <div className="w-1/4">
                        <p className=" text-xs font-thin italic">
                          Last Transaction{" "}
                          {getMinutesDifference(arr.updated_at)} minutes ago
                        </p>
                      </div>
                    </div>
                    <p className="text-xl font-semibold ml-2">
                      Status: <span className=" uppercase">{arr.status}</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No data available</p>
            )}
          </div>
          <button onClick={handleNext}>
            <FaArrowCircleRight size={24} />
          </button>
        </div>
      </div>
      <div className="p-4 flex gap-2 w-full h-auto">
        <div className="w-1/2 h-auto">
          <BarChartComponent />
        </div>
        <div className="w-1/2 h-auto">
          <PieChartComponent />
        </div>
      </div>
    </div>
  );
};

export default FuelStatusSlider;
