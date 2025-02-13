import React from "react";

const FuelTable = () => {
  const dummyData = {
    id: 1,
    timeDate: "2023-10-18 15:13:17",
    station: "Station2",
    name: "andrew",
    license: "B1235 K",
    code: "20130",
    file: "portalite",
    usage: 2,
    over: 150,
  };

  const data = Array(10).fill(dummyData);

  return (
    <div className="p-6">
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Time/Date
              </th>
              <th className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Station
              </th>
              <th className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                License
              </th>
              <th className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Code
              </th>
              <th className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                File
              </th>
              <th className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Usage (L)
              </th>
              <th className=" px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Over (L)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="bg-[#1b213b] px-6 py-4 whitespace-nowrap text-sm text-white">
                  {item.id}
                </td>
                <td className="bg-[#1b213b] px-6 py-4 whitespace-nowrap text-sm text-white">
                  {item.timeDate}
                </td>
                <td className="bg-[#1b213b] px-6 py-4 whitespace-nowrap text-sm text-white">
                  {item.station}
                </td>
                <td className="bg-[#1b213b] px-6 py-4 whitespace-nowrap text-sm text-white">
                  {item.name}
                </td>
                <td className="bg-[#1b213b] px-6 py-4 whitespace-nowrap text-sm text-white">
                  {item.license}
                </td>
                <td className="bg-[#1b213b] px-6 py-4 whitespace-nowrap text-sm text-white">
                  {item.code}
                </td>
                <td className="bg-[#1b213b] px-6 py-4 whitespace-nowrap text-sm text-white">
                  {item.file}
                </td>
                <td className="bg-[#1b213b] px-6 py-4 whitespace-nowrap text-sm text-white">
                  {item.usage}
                </td>
                <td className="bg-[#1b213b] px-6 py-4 whitespace-nowrap text-sm text-white">
                  {item.over}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FuelTable;
