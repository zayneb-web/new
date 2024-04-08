import React, { useState } from "react";
import { MdOutlineAddTask, MdOutlinePendingActions, MdSettings, MdTaskAlt, MdEventAvailable } from "react-icons/md";
import { FaTasks, FaTrashAlt, FaUsers, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/userSlice";
import { MessageSquarePlus } from 'lucide-react';
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import AddEvent from "./AddEvent";
import { MdOutlineSearch } from "react-icons/md";
import Event from "../pages/Event";
import MyEvents from "../pages/MyEvents";
import { SiGooglemeet } from "react-icons/si";
import Video from "../pages/Video"

import { searchEvents } from "../utils/api"; // Import the searchEvents function
const linkData = [

  {
    label: "Events",
    link: "/Event",
    icon: <MdEventAvailable />,
  },
  {
    label: "Your Events",
    link: "/MyEvents",
    icon: <FaUser />,
  },
 
  
];

const Sidebar = ({ setSearchedEvent }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5000/event/searchevents?searchQuery=${searchQuery}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error("Failed to fetch search results");
      }
    } catch (error) {
      console.error("Error searching events:", error);
    }
  };
  

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const [showAddEvent, setShowAddEvent] = useState(false); // State variable to manage AddEvent form visibility

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const NavLink = ({ el }) => {
    return (
      <Link
        to={el.link}
        onClick={closeSidebar}
        className={clsx(
          "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#2564ed2d]",
          path === el.link.split("/")[0] ? "bg-blue-700 text-neutral-100" : ""
        )}
      >
        {el.icon}
        <span className='hover:text-[#2564ed]'>{el.label}</span>
      </Link>
    );
  };

  return (
    <>
      <div className='w-full h-full flex flex-col gap-6 p-5'>
      <div className="flex   items-center gap-2">
        <MdOutlineAddTask className="text-[#D00000] text-4xl" />
        <h1 className="text-3xl font-bold text-black">Events</h1>
      </div>

        {/* Search Input */}
        <div className="w-64 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-full bg-[#f3f4f6]">
          <MdOutlineSearch className="text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Search...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800"
          />
          <button onClick={handleSearch} className="text-gray-800 font-semibold">
            Search
          </button>
        </div>

        {/* Display Search Results */}
        {searchResults && searchResults.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-bold">Search Results:</h2>
            <ul>
              {searchResults.map((event) => (
                <li key={event._id}>{event.title}</li>
              ))}
            </ul>
          </div>
        )}

        <div className='flex-1 flex flex-col gap-y-5 py-8'>
          {sidebarLinks.map((link) => (
            <NavLink el={link} key={link.label} />
          ))}
          <div className="item-center mr-8 px-3" style={{ display: 'flex', alignItems: 'center' }}>
      <SiGooglemeet style={{ marginRight: '5px' }}/> {/* Adjust styling as needed */}
      <Link to="/VideoPage" style={{ textDecoration: 'none', color: 'inherit', marginRight: '5px' }}>Meet</Link>
    </div>
<div className=''>

          <button
            onClick={() => setShowAddEvent(true)}
            className='w-full flex gap-2 p-2 items-center text-lg text-gray-800 bg-gray hover:bg-[#2564ed2d] rounded'
          >
            <MessageSquarePlus />
            <span>Create Event</span>
          </button>
        </div>

        </div>
            
      </div>
      {showAddEvent && <AddEvent onClose={() => setShowAddEvent(false)} />} {/* Pass onClose prop to handle closing AddEvent */}
    </>
  );
};

export default Sidebar;
