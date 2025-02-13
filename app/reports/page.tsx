"use client";

import dynamic from "next/dynamic";
import React from "react";
import FuelTable from "../components/FuelTable";

const CustomDatePicker = dynamic(
  () => import("../components/CustomDatePicker"),
  { ssr: false }
);

const Report: React.FC = () => {
  return (
    <div className="w-full h-screen bg-[#1b213b]">
      <div className="header flex justify-between items-center p-4">
        <p className="font-bold text-3xl">Fuel Transaction History</p>
        <CustomDatePicker />
      </div>
      <FuelTable />
    </div>
  );
};

export default Report;
