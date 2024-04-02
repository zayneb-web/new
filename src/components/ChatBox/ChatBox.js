import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  getMessages,
  getUserInfo,
  getUsersForSidebar,
} from "../../utils/api";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import axios from "axios";
import { addMessages } from "../../redux/chatSlice"; // Import the addMessages action
import { NoProfile } from "../../assets";
import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
export const ChatBox = ({
  chat,
  currentUser,
  setSendMessage,
  receivedMessage,
}) => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((state) => state.user.user);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [callError, setCallError] = useState(null);
  const zeroCloudInstance = useRef(null);
  const [calleeId, setCalleeId] = useState(""); // Define calleeId state
  const scroll = useRef();

  function randomID(len) {
    let result = "";
    if (result) return result;
    var chars =
        "12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP",
      maxPos = chars.length,
      i;
    len = len || 5;
    for (i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
  }
  function getUrlParams(url = window.location.href) {
    let urlStr = url.split("?")[1];
    return new URLSearchParams(urlStr);
  }
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const fetchedUserData = await getUserInfo(
          user.token,
          chat.members.find((id) => id !== currentUser)
        );
        setUserData(fetchedUserData);
        const roomID = getUrlParams().get("roomID") || randomID(5);

        const userName = fetchedUserData.firstName;
        const userId = fetchedUserData._id;
        console.log("username and id", userName, userId);
        // Extract user information

        // Set up Zego SDK parameters
        const appID = 687400643; // Replace with your actual app ID
        const serverSecret = "6d0b0ee1fd08f7b6e3eb5e5ed8b2da5a"; // Replace with your actual server secret

        // Generate Zego SDK kit token
        const KitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          userId,
          userName
        );
        console.log("KitToken", KitToken);

        // Initialize zeroCloudInstance.current with the generated kit token
        zeroCloudInstance.current = ZegoUIKitPrebuilt.create(KitToken);
        console.log("zeroCloudInstance", zeroCloudInstance.current);
        // Add any necessary plugins (example: ZIM plugin)
        zeroCloudInstance.current.addPlugins({ ZIM });
      } catch (error) {
        console.log(error);
      }
    };

    if (user && chat) {
      fetchUserData();
    }
  }, [chat, currentUser, user]);

  function handleSendcall(callType) {
    const sender = user._id;
    const callee = user._id;
    if (!callee) {
      setCallError("userID cannot be empty!!"); // Update callError state
      return;
    }

    // Clear callError state when attempting to send a call
    setCallError(null);

    // send call invitation
    zeroCloudInstance.current
      .sendCallInvitation({
        callees: [{ userID: callee, userName: "user_" + callee }],
        callType: callType,
        timeout: 60,
        sender: sender, // Add sender ID
      })
      .then((res) => {
        console.warn(res);
        if (res.errorInvitees.length) {
          setCallError("The user does not exist or is offline."); // Update callError state
        }
      })
      .catch((err) => {
        console.error(err);
        setCallError("Error sending call invitation."); // Update callError state
      });
  }
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getMessages(chat._id, user.token);
        setMessages(data);
        console.log("data", data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat) {
      fetchMessages();
    }
  }, [chat, user]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };
  const handleSend = async () => {
    if (!newMessage.trim() && !selectedImage && !selectedVideo) {
      // If there is no text message, no image, and no video selected, return early
      return;
    }

    try {
      let messageData = {
        senderId: currentUser,
        chatId: chat._id,
        text: newMessage.trim(),
        file: selectedImage ? selectedImage.name : "",
        video: "", // Initialize video attribute as an empty string
      };

      if (selectedImage) {
        // If an image is selected, upload it to Cloudinary
        const form = new FormData();
        form.append("file", selectedImage);
        form.append("upload_preset", "socialMediaChat");

        // Upload image to Cloudinary
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dqthcvs08/image/upload",
          form
        );
        const imageUrl = response.data.secure_url;

        // Update the image attribute in the message with the Cloudinary URL
        messageData.file = imageUrl;
      }

      if (selectedVideo) {
        // If a video is selected, upload it to Cloudinary
        const form = new FormData();
        form.append("file", selectedVideo);

        form.append("upload_preset", "socialMediaChat");

        // Upload video to Cloudinary
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dqthcvs08/video/upload",
          form
        );
        const videoUrl = response.data.secure_url;

        // Update the video attribute in the message with the Cloudinary URL
        messageData.video = videoUrl;
      }

      // Emit the message data to the socket server
      const receiverId = chat.members.find((id) => id !== currentUser);
      setSendMessage({ ...messageData, receiverId });
      dispatch(addMessages(messageData)); // Dispatch addMessages action
      // Add the message to the database
      const data = await addMessage(messageData, user.token);

      // Update the message list with the new message
      setMessages([...messages, messageData]);
      setNewMessage("");
      setSelectedFile(null);
      setSelectedImage(null);
      setSelectedVideo(null);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (receivedMessage && receivedMessage.chatId === chat._id) {
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    }
  }, [receivedMessage, chat]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log("file", file);
    setSelectedFile(file);
    setNewMessage(file.name);
  };
  const handleVideoChange = (event) => {
    const video = event.target.files[0];
    setSelectedVideo(video); // Update selectedVideo state
    setNewMessage(video.name); // Update the message input with the video name
  };

  const handleImageChange = (event) => {
    const image = event.target.files[0];
    console.log("image", image);
    setSelectedImage(image); // Update selectedImage state, not setSelectedFile
    setNewMessage(image.name); // Update the message input with the file name
  };

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {chat ? (
        <>
          <div className="chat-area">
            {messages.map((message, index) => (
              <div
                ref={scroll}
                key={index}
                className={`chat ${
                  message.senderId === currentUser ? "chat-end" : "chat-start"
                }`}
              >
                <div class="chat-image avatar">
                  <div class="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS chat bubble component"
                      src={user?.profileUrl ?? NoProfile}
                    />
                  </div>
                </div>
                {message.file ? (
                  // Display image if message has a file
                  <div>
                    <img
                      src={message.file}
                      alt="attachment"
                      className="chat-image"
                    />
                    <span>{format(message.createdAt)}</span>
                  </div>
                ) : message.video ? (
                  // Display video if message has a video
                  <div>
                    <video controls className="chat-video">
                      <source src={message.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <span>{format(message.createdAt)}</span>
                  </div>
                ) : (
                  // Display text message if no file or video
                  <div
                    className={`chat-bubble ${
                      message.senderId === currentUser
                        ? "chat-bubble-primary"
                        : "chat-bubble"
                    }`}
                  >
                    <span>{message.text}</span>
                    <div className="chat-msg-date">
                      <span>{format(message.createdAt)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="chat-area-footer">
              <div className="file-upload-container">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <button
                  className="file-upload-button"
                  onClick={() => document.getElementById("file-upload").click()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18.97 3.659a2.25 2.25 0 0 0-3.182 0l-10.94 10.94a3.75 3.75 0 1 0 5.304 5.303l7.693-7.693a.75.75 0 0 1 1.06 1.06l-7.693 7.693a5.25 5.25 0 1 1-7.424-7.424l10.939-10.94a3.75 3.75 0 1 1 5.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 0 1 5.91 15.66l7.81-7.81a.75.75 0 0 1 1.061 1.06l-7.81 7.81a.75.75 0 0 0 1.054 1.068L18.97 6.84a2.25 2.25 0 0 0 0-3.182Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="file-upload-container">
                <input
                  type="file"
                  id="image-upload"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <button
                  onClick={() =>
                    document.getElementById("image-upload").click()
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </button>
              </div>
              <div className="file-upload-container">
                <input
                  type="file"
                  id="video-upload"
                  style={{ display: "none" }}
                  onChange={handleVideoChange}
                  accept="video/*"
                />
                <button
                  className="file-upload-button"
                  onClick={() =>
                    document.getElementById("video-upload").click()
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                    />
                  </svg>
                </button>
              </div>
              <InputEmoji value={newMessage} onChange={setNewMessage} />
              <div className="btn btn-sm btn btn-primary" onClick={handleSend}>
                Send
              </div>
            </div>
          </div>

          <div className="detail-area">
            <div className="detail-area-header">
              <div className="msg-profile group">
                <svg
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="css-i6dzq1"
                >
                    <path d="M12 2l10 6.5v7L12 22 2 15.5v-7L12 2zM12 22v-6.5" />
                    <path d="M22 8.5l-10 7-10-7" />
                    <path d="M2 15.5l10-7 10 7M12 2v6.5" />
                  </svg>
              </div>
              <div className="detail-title"> {userData?.firstName} {userData?.lastName} </div>
             
             

              <div className="detail-buttons">
                <button className="detail-button"   onClick={() =>
                    handleSendcall(ZegoUIKitPrebuilt.InvitationTypeVideoCall)
                  }>
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={0}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-phone"
                  >
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  video call
                </button>
                <button className="detail-button"  onClick={() =>
                    handleSendcall(ZegoUIKitPrebuilt.InvitationTypeVoiceCall)
                  }>
                  <svg
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth={0}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="feather feather-video"
                  >
                    <path d="M23 7l-7 5 7 5V7z" />
                    <rect x={1} y={5} width={15} height={14} rx={2} ry={2} />
                  </svg>
                  voice call
                </button>
               
              </div>
            </div>
            <div className="detail-photos">
              <div className="detail-photo-title">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-image"
                >
                  <rect x={3} y={3} width={18} height={18} rx={2} ry={2} />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                Shared photos
              </div>
              <div className="detail-photo-grid">
                <img src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2168&q=80" />
                <img src="https://images.unsplash.com/photo-1516085216930-c93a002a8b01?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80" />
                <img src="https://images.unsplash.com/photo-1458819714733-e5ab3d536722?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=933&q=80" />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <div className="px-4 text-center sm:text-lg md:text-xl text-black-200 font-semibold flex flex-col items-center gap-2">
            <p>Welcome 👋 {user.firstName} </p>
            <p>Select a chat to start messaging</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
