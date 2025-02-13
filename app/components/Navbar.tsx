import { FaSearch } from "react-icons/fa";
import TimeDateDisplay from "./TimeDateDisplay";
import AvatarProfile from "./avatarProfile";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-4 w-full bg-[#0c0d21]">
      <div className="flex">
        <img
          src="http://image1ws.indotrading.com/s3/webp/co270821/companylogo/w40-h22/ravelwaretechnologyindonesia1ee67160-d83b-4456-8d2d-3593dbf9a9e7.jpg"
          alt=""
        />
        <p className=" font-bold text-lg">AVELWARE</p>
        <div className="relative ml-4">
          <input
            type="text"
            id="input-group-1"
            className=" text-sm rounded-lg bg-[#1b213b] focus:ring-blue-500 focus:border-blue-500 block w-full  py-1 px-2"
            placeholder="Search"
          />
          <div className="absolute inset-y-0 end-2  flex items-center ps-3.5 pointer-events-none">
            <FaSearch size={12} />
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <TimeDateDisplay />
        <AvatarProfile />
      </div>
    </div>
  );
};

export default Navbar;
