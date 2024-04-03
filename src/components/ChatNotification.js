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
          const senderName = `${senderData?.firstName} ${senderData?.lastName}`;
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
      <button onClick={toggleDropdown} className="relative">
        <Badge badgeContent={badgeCount} color="error">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
          </svg>
        </Badge>
      </button>
  
      {dropdownOpen && (
        <>
          <div onClick={toggleDropdown} className="fixed inset-0 h-full w-full z-10"></div>
          <div className="absolute right-0 mt-2 bg-gray-100 bg-primary rounded-lg shadow-lg overflow-hidden z-20" style={{ width: '19rem', maxHeight: '20rem' }}>
            <div className="py-2" style={{ overflowY: 'auto', maxHeight: '16rem' }}>
              {Object.values(lastMessages).length > 0 ? (
                Object.values(lastMessages).map((message, index) => (
                  <Link to={`/chat
                  `} className="flex items-center px-4 py-3 hover:bg-bgColor bg-primary -mx-2" onClick={() => handleNotificationClick(message.senderId)} key={index}>
                    <img className="h-8 w-8 rounded-full object-cover mx-1" src={user?.profileUrl ?? NoProfile} alt="Profile" />
                    <p className="text-gray-600 text-sm mx-2">
                      <span className="font-bold">{message?.senderName}: {message.text}</span>
                    </p>
                  </Link>
                ))
              ) : (
                <div className="text-center text-gray-600 py-3">No messages yet</div>
              )}
            </div>
            <Link to="/chat" className="block bg-gray-800 text-white text-center font-bold py-2">open in chat</Link>
          </div>
        </>
      )}

      {dropdownOpen && Object.values(lastMessages).length === 0 && (
        <div onClick={toggleDropdown} className="fixed inset-0 h-full w-full z-10"></div>
      )}
    </>
  );  
}

export default ChatNotification;