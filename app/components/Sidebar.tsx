"use client";
import Link from "next/link";
import { useState } from "react";
import { FaSortUp } from "react-icons/fa";

interface MenuItem {
  title: string;
  icon?: string;
  href?: string;
  subMenu?: MenuItem[];
}

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: "LayoutDashboard",
      href: "/",
    },
    {
      title: "Report",
      icon: "FileText",
      subMenu: [
        {
          title: "Fuel Transaction History",
          href: "/reports",
        },
        {
          title: "Machine Usage",
          href: "/",
        },
        {
          title: "Manpower Usage",
          href: "/",
        },
      ],
    },
    {
      title: "History",
      icon: "History",
      href: "/history",
    },
    {
      title: "Management",
      icon: "Settings",
      href: "/management",
    },
    {
      title: "Profile",
      icon: "User",
      href: "/profile",
    },
  ];

  const toggleSubMenu = (title: string) => {
    setActiveMenu(activeMenu === title ? null : title);
  };

  return (
    <ul className="bg-[#0c0d21] h-screen w-[10%] flex flex-col gap-4 p-2">
      {menuItems.map((item) => (
        <li key={item.title} className="text-lg font-semibold ">
          {item.subMenu ? (
            <>
              <div
                className="cursor-pointer flex justify-between items-center"
                onClick={() => toggleSubMenu(item.title)}
              >
                {item.title}
                <FaSortUp
                  className={`${
                    activeMenu === item.title ? "rotate-180" : ""
                  } transition-transform duration-300`}
                  size={20}
                />
              </div>
              {activeMenu === item.title && (
                <ul className="mt-2 ml-4 ">
                  {item.subMenu.map((subItem) => (
                    <li
                      key={subItem.title}
                      className=" mt-2 text-sm font-normal "
                    >
                      <Link href={subItem.href || "#"}>{subItem.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <Link href={item.href || "#"}>{item.title}</Link>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Sidebar;
