import React, { useState } from 'react';
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
  MdEventAvailable,
} from 'react-icons/md';
import { FaTasks, FaTrashAlt, FaUsers, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { setOpenSidebar } from '../../redux/userSlice';
import TextInput from '../TextInput';
import CustomButton from '../CustomButton';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { MdOutlineSearch } from 'react-icons/md';

const Sidebar = ({ linkData }) => {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const location = useLocation();

  const path = location.pathname.split('/')[1];

  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5);

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const [showAddEvent, setShowAddEvent] = useState(false); // State variable to manage AddEvent form visibility

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleSearch = async (data) => {};

  const NavLink = ({ el }) => {
    return (
      <Link
        to={el.link}
        onClick={closeSidebar}
        className={clsx(
          'w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#2564ed2d]',
          path === el.link.split('/')[0] ? 'bg-blue-700 text-neutral-100' : ''
        )}
      >
        {el.icon}
        <span className="hover:text-[#2564ed]">{el.label}</span>
      </Link>
    );
  };

  return (
    <>
      <div className="w-full  h-full flex flex-col gap-6 p-5">
        <h1 className="flex gap-1 items-center">
          <p className="bg-blue-600 p-2 rounded-full">
            <MdOutlineAddTask className="text-black text-2xl font-black" />
          </p>
          <span className="text-3xl font-bold text-black">Tasks</span>
        </h1>

        <div className="w-64 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-full bg-[#f3f4f6]">
          <MdOutlineSearch className="text-gray-500 text-xl" />

          <input
            type="text"
            placeholder="Search...."
            className="flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800"
          />
        </div>

        <div className="flex-1 flex flex-col gap-y-5 py-8">
          {sidebarLinks.map((link) => (
            <NavLink el={link} key={link.label} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
