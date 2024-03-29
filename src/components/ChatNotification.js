import React, { useState, useEffect } from 'react';
import { IconButton, Badge } from "@mui/material";
import { MdMail } from "react-icons/md"; 
import { Link } from 'react-router-dom'; 
import { useSelector, useDispatch } from 'react-redux';
import { getUserInfo } from "../utils/api";
import { format } from "timeago.js";
import { decrementBadgeCount } from '../redux/chatSlice'; // Import the action from your slice
import { NoProfile } from "../assets";
const ChatNotification = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const notifications = useSelector((state) => state.chat.messages);
  const badgeCount = useSelector((state) => state.chat.badgeCount);
  const currentUser = useSelector((state) => state.user.user);
  const notification = useSelector((state) => state.chat.notification);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [lastMessages, setLastMessages] = useState({});

  useEffect(() => {
    const computeLastMessage = async () => {
      const lastMessagesData = {};
      // Loop through messages in reverse order to get the latest message for each sender
      for (let i = notifications.length - 1; i >= 0; i--) {
        const notification = notifications[i];
        const senderId = notification.senderId;
        if (!lastMessagesData[senderId]) {
          // Fetch sender's data
          const senderData = await getUserInfo(currentUser.token, senderId);
          const senderName = `${senderData.firstName} ${senderData.lastName}`;
          lastMessagesData[senderId] = { ...notification, senderName };
        }
      }
      setLastMessages(lastMessagesData);
    };
  
    computeLastMessage();
  }, [notifications, currentUser]);

  useEffect(() => {
    // Update badge count when notification changes
   // setBadgeCount(notification.badgeCount);
  }, [notification]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleNotificationClick = (senderId) => {
    dispatch(decrementBadgeCount(senderId)); // Dispatch action to decrement badge count for the specific sender
  };

  return (
    <>
      <button onClick={toggleDropdown}>
        <Badge badgeContent={badgeCount} color="error">
          <MdMail />
        </Badge>
      </button>

      {dropdownOpen && (
        <>
          <div onClick={toggleDropdown} className="fixed inset-0 h-full w-full z-10"></div>
          <div className="absolute right-0 mt-2 bg-gray-100 bg-primary rounded-md shadow-lg overflow-hidden z-20" style={{ width: '20rem', maxHeight: '20rem' }}>
            <div className="py-2" style={{ overflowY: 'auto', maxHeight: '16rem' }}>
              {Object.values(lastMessages).map((message, index) => (
                <Link  to={`/chat/${message.senderId}`} className="flex items-center px-4 py-3 hover:bg-bgColor bg-primary -mx-2" onClick={() => handleNotificationClick(message.senderId)}>
                  <img className="h-8 w-8 rounded-full object-cover mx-1"src={user?.profileUrl ?? NoProfile} />

                  <p className="text-gray-600 text-sm mx-2">
                    <span className="font-bold">{message.senderName}<span className="font-bold text-blue-500">: {message.text}</span>  <span></span></span>
                  </p>
                </Link>
              ))}
            </div>
            <Link to="/chat" className="block bg-gray-800 text-white text-center font-bold py-2">See all messages</Link>
          </div>
        </>
      )}
    </>
  );
};

export default ChatNotification;