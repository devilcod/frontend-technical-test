"use client";
import { useState } from "react";
import { FaUserCircle, FaEdit, FaCog, FaSignOutAlt } from "react-icons/fa";

const AvatarProfile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleOptionClick = (option: string) => {
    console.log(`You clicked ${option}`);
    setIsMenuOpen(false);
  };

  return (
    <div className="relative">
      <div
        className="flex gap-2 items-center cursor-pointer"
        onClick={toggleMenu}
      >
        <FaUserCircle size={24} />

        <p className="font-medium">Dio Aryatama</p>
      </div>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white text-black border rounded-md shadow-lg z-10">
          <ul className="py-1">
            <li
              className="px-4 py-2 flex gap-2 justify-start items-center hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionClick("My Profile")}
            >
              <FaUserCircle size={16} />
              <span>My Profile</span>
            </li>
            <li
              className="px-4 py-2 flex gap-2 justify-start items-center hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionClick("Edit Profile")}
            >
              <FaEdit size={16} />
              <span>Edit Profile</span>
            </li>
            <li
              className="px-4 py-2 flex gap-2 justify-start items-center hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionClick("Setting")}
            >
              <FaCog size={16} />
              <span>Setting</span>
            </li>
            <li
              className="px-4 py-2 flex gap-2 justify-start items-center hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionClick("Logout")}
            >
              <FaSignOutAlt size={16} />
              <span>Logout</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AvatarProfile;
