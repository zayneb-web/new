import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Badge } from "@mui/material";
import { MdMail } from "react-icons/md";
import ChatNotification from './ChatNotification';
import { SetTheme } from "../redux/theme";
import { Logout } from "../redux/userSlice";
import { logo } from "../assets";
import { decrementBadgeCount } from '../redux/chatSlice';

const TopBar = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.user);
  const notification = useSelector((state) => state.chat.notification); 

  const handleTheme = () => {
    const themeValue = theme === "light" ? "dark" : "light";
    dispatch(SetTheme(themeValue));
  };

  const handleLogout = () => {
    dispatch(Logout());
  };

  const handleNotificationClick = (senderId) => {
    dispatch(decrementBadgeCount(senderId)); // Dispatch action to decrement badge count for the specific sender
  };

  return (
    <div className='topbar w-full flex items-center justify-between py-3 md:py- px-4 bg-primary'>
      <Link to='/'>
        <div className='p-1 md:p-2  rounded text-white'>
          <img
            src={logo}
            alt='Bg Image'
            className='w-14 h-14 object-cover rounded'
          />
        </div>
        <span className='text-xl md:text-2xl text-[#D00000] font-bold'>
          ESPRIT
        </span>
      </Link>

      <div className='flex gap-4 items-center text-ascent-1 text-md md:text-xl'>
        <button onClick={() => handleTheme()}>
          {theme ? <BsMoon /> : <BsSunFill />}
        </button>

        <Link to="#">
          <ChatNotification onClick={handleNotificationClick} notification={notification} />
          {notification && notification.badgeCount > 0 && (
            <Badge badgeContent={notification.badgeCount} color="error">
              <MdMail />
            </Badge>
          )}
        </Link>

        <div className='hidden lg:flex'>
          <IoMdNotificationsOutline />
        </div>

        <div>
          <button onClick={() => handleLogout()} className='text-sm text-ascent-1 px-4 md:px-6 py-1 md:py-2 border border-[#666] rounded-full bg-[#F76566]'>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
