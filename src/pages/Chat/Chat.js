import React, { useRef, useState, useEffect } from "react";
import "./chat.css";
import { getUserChats ,createChat ,searchUsers} from "../../utils/api";
import { useSelector, useDispatch } from "react-redux";
import Conversation from "../../components/Conversation";
import { ChatBox } from "../../components/ChatBox/ChatBox";
import { io } from "socket.io-client";
import TopBar from '../../components/TopBar';
import { setChats, setCurrentChat, receiveMessage } from "../../redux/chatSlice";

function Chat() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const chats = useSelector((state) => state.chat.chats);
  const currentChat = useSelector((state) => state.chat.currentChat);
  const notification = useSelector((state) => state.chat.notification); // Access notification from Redux state
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

  const socket = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socketOptions = {
      query: {
        token: user.token,
        userId: user?._id
      },
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: token ? `Bearer ${token}` : ""
          }
        }
      }
    };
    socket.current = io("http://localhost:5000", socketOptions);

    socket.current.emit("new-user-add", user._id);

    socket.current.on("get-users", (users) => {
      console.log("users", users);
    });
    socket.current.on('notification', (message) => {
      // Update the notification state with the new notification
      setNotifications((prevNotifications) => [...prevNotifications, message]);
      console.log("message", message);
      // Increment the badge count
      //dispatch(incrementBadgeCount());
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [user]);

  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
      console.log("send message", sendMessage);
    }
  }, [sendMessage]);
  useEffect(() => {
    socket.current.on("recieve-message", (data) => {
     setReceivedMessage(data);
      dispatch(receiveMessage(data)); // Dispatch the receiveMessage action
      console.log("receive message", data);
    });
  }, [dispatch]);

  useEffect(() => {
    const getChats = async () => {
      try {
        const data = await getUserChats(user._id, user.token);
        dispatch(setChats(data));
        console.log("chats", data);
      } catch (error) {
        console.log(error);
      }
    };
    if (user._id && user.token) {
      getChats();
    }
  }, [user, dispatch]);

  //console.log("Notification:", notification); // Check if notification is updated


  useEffect(() => {
    const getChats = async () => {
      try {
        const data  = await getUserChats(user._id, user.token);
        dispatch(setChats(data)); // Dispatch setChats action to update Redux state
        console.log("chats", data);
        console.log("chats", data);
      } catch (error) {
        console.log(error);
      }
    };
    if (user._id && user.token) {
      getChats();
    }
  }, [user._id, user.token]);
  const handleUserSelection = async (selectedUserId) => {
    setLoading(true);
    try {
      // Create a chat with the selected user
      const chat = await createChat({ senderId: user._id, receiverId: selectedUserId }, user.token);
      dispatch(setCurrentChat(chat)); // Update current chat in Redux store
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  

  return (
    <>
      <TopBar />
      <div className='w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden'>
      
        <div className="app ">
          <div className="header">
            <div className="logo">
              <svg viewBox="0 0 513 513" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M256.025.05C117.67-2.678 3.184 107.038.025 245.383a240.703 240.703 0 0085.333 182.613v73.387c0 5.891 4.776 10.667 10.667 10.667a10.67 10.67 0 005.653-1.621l59.456-37.141a264.142 264.142 0 0094.891 17.429c138.355 2.728 252.841-106.988 256-245.333C508.866 107.038 394.38-2.678 256.025.05z" />
                <path d="M330.518 131.099l-213.825 130.08c-7.387 4.494-5.74 15.711 2.656 17.97l72.009 19.374a9.88 9.88 0 007.703-1.094l32.882-20.003-10.113 37.136a9.88 9.88 0 001.083 7.704l38.561 63.826c4.488 7.427 15.726 5.936 18.003-2.425l65.764-241.49c2.337-8.582-7.092-15.72-14.723-11.078zM266.44 356.177l-24.415-40.411 15.544-57.074c2.336-8.581-7.093-15.719-14.723-11.078l-50.536 30.744-45.592-12.266L319.616 160.91 266.44 356.177z" fill="#fff" />
              </svg>
            </div>
            <div className="search-bar">
              
            </div>
            <div className="user-settings">
              <div className="settings">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00-.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="wrapper">

  <div className="Chat-list">
    {searchResults.map(user => (
      <div key={user._id} onClick={() => handleUserSelection(user._id)}>
        {user.firstName} {user.lastName}
      </div>
    ))}
    {chats.map((chat) => (
      <div
        key={chat._id} // Assuming each chat has a unique identifier
        onClick={() => {
          dispatch(setCurrentChat(chat)); 
        }}
      >
        <Conversation data={chat} currentUser={user._id} /> 
      </div>
    ))}
  </div>
  <ChatBox
    chat={currentChat}
    currentUser={user._id}
    setSendMessage={setSendMessage}
    receivedMessage={receivedMessage}
  />
</div>

        </div>
      </div>
    </>
  );
}

export default Chat;