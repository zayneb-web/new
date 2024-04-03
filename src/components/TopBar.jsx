import React from "react";
import { TbSocial } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import TextInput from "./TextInput";
import CustomButton from "./CustomButton";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";

import { logo } from "../assets";
import { Badge } from "@mui/material";
import { MdMail } from "react-icons/md";
import ChatNotification from './ChatNotification';
import { decrementBadgeCount } from '../redux/chatSlice';

const TopBar = () => {
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.chat.notification); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue));
  };

  const handleSearch = async (data) => {};
  const handleNotificationClick = (senderId) => {
    dispatch(decrementBadgeCount(senderId)); // Dispatch action to decrement badge count for the specific sender
  };

  return (


    <div className='topbar w-full flex items-center justify-between py-3 md:py- px-4 bg-primary'>


      <Link to='/' className='flex gap-2 items-center'>
        <div className='p-1 md:p-2  rounded text-white'>
        <img
              src={logo}
              alt='Bg Image'
              className='w-14 h-14 object-cover rounded'
            />
        </div>


        <span className='text-xl md:text-2xl text-[#d00000] font-bold'>
          ESPRIT

        </span>
      </Link>

      <form
        className='hidden md:flex items-center justify-center'
        onSubmit={handleSubmit(handleSearch)}
      >
        <TextInput
          placeholder='Search...'
          styles='w-[4rem] lg:w-[17rem]  rounded-l-full py-3 '
          register={register("search")}
        />
        <CustomButton
          title='Search'
          type='submit'
          containerStyles='bg-[#D00000] text-white px-6 py-2.5 mt-2 rounded-r-full'
        />
      </form>

      {/* ICONS */}
      <div className='flex gap-4 items-center text-ascent-1 text-md md:text-xl '>
        <button onClick={() => handleTheme()}>
          {theme ? <BsMoon /> : <BsSunFill />}
        </button>
        <Link to="#">
          <ChatNotification onClick={handleNotificationClick} notification={notification} />
          {notification && notification.badgeCount > 0 && (
            <Badge badgeContent={notification.badgeCount} color="error">
            
            </Badge>
          )}
        </Link>

        <div className='hidden lg:flex'>
          <IoMdNotificationsOutline />
        </div>

        <div>
          <CustomButton
            onClick={() => dispatch(Logout())}
            title='Log Out'


            containerStyles='text-sm text-white px-4 md:px-6 py-1 md:py-2 rounded-full bg-[#D00000]'


          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;