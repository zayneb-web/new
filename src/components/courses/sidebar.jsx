import React, { useState, useMemo } from 'react';
import {
  MdDashboard,
  MdEventAvailable,
  MdOutlineAddTask,
  MdOutlineSearch,
} from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { MessageSquarePlus } from 'lucide-react';
import { SiGooglemeet } from "react-icons/si";

const Sidebar = ({ setSearchedCourse }) => {
  const location = useLocation();
  const path = location.pathname.split('/')[1];

  const [selectedItem, setSelectedItem] = useState(path);

  const linkData = useMemo(
    () => [
      {
        label: 'My Courses',
        link: 'course',
        icon: <MdDashboard />,
      },
      {
        label: 'All Courses',
        link: 'allcourse',
        icon: <MdEventAvailable />,
      },
      {
        label: 'Add Course',
        link: 'addcourse',
        icon: <MessageSquarePlus />,
      },
      {
        label: 'Meet',
        link: 'VideoPage',
        icon: <SiGooglemeet />,
      },
    ],
    []
  );

  const handleItemClick = (link) => {
    setSelectedItem(link);
  };
  const handleSearch = (e) => {
    console.log('search', e.target.value);
    setSearchedCourse(e.target.value);
  };
  return (
    <div className="h-full flex flex-col  p-5 bg-white">
      <div className="flex   items-center gap-2">
        <MdOutlineAddTask className="text-[#D00000] text-4xl" />
        <h1 className="text-3xl font-bold text-black">Courses</h1>
      </div>
      <div className="flex flex-col mt-2 justify-between mb-5">
        <div className="w-64 2xl:w-[400px] flex  items-center py-2 px-3 gap-2 rounded-full bg-[#f3f4f6]">
          <MdOutlineSearch className="text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Search...."
            className="flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800"
            onChange={(e) => handleSearch(e)}
          />
        </div>
        {linkData.map((link) => (
          <Link
            key={link.link}
            to={`/${link.link}`}
            className={clsx(
              'py-2 px-4 rounded-md flex items-center gap-2 mt-4',
              link.link === selectedItem
                ? 'bg-[#D00000] text-white'
                : 'hover:bg-[#e5e7eb] text-[#1f2937]'
            )}
            onClick={() => handleItemClick(link.link)}
            aria-label={link.label}
            aria-current={link.link === selectedItem ? 'page' : undefined}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;