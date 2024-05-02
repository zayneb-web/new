import React, { useState, useEffect } from "react";
import { getUserInfo, getUsersBySearch } from "../utils/api";
import { useSelector, useDispatch } from "react-redux";
import { NoProfile } from "../assets";

const Conversation = ({ data, currentUser, online, friendSuggestions }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [userData, setUserData] = useState(null);
  const [sidebarUsers, setSidebarUsers] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const user = useSelector((state) => state?.user?.user);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const fetchedUserData = await getUserInfo(
          user?.token,
          data?.members.find((id) => id !== currentUser)
        );
        setUserData(fetchedUserData);
      } catch (error) {
        console.log(error);
      }
    };
  
    const fetchGroupMembers = async () => {
      try {
        const fetchedMembers = await Promise.all(
          data.members.map(async (memberId) => {
            return await getUserInfo(user?.token, memberId);
          })
        );
  
        // Prepend the fetched members to the existing sidebarUsers array
        setSidebarUsers((prevUsers) => [...fetchedMembers.reverse(), ...prevUsers]);
      } catch (error) {
        console.log(error);
      }
    };
  
    if (user && data) {
      fetchUserData();
      fetchGroupMembers();
    }
  }, [data, currentUser, user]);
  
  return (
    <div className="conversation-container" style={{ maxHeight: "300px", overflowY: "auto" }}>
      <div className="conversation-area">
        {showSearchResults ? (
          <ul>
            {sidebarUsers.map((user) => (
              <li key={user._id}>{user.firstName} {user.lastName}</li>
            ))}
          </ul>
        ) : (
          <div className={`msg ${online ? "online" : "offline"}`}>
                   <img
  className="msg-profile"
  src={
    !data.isGroupChat && userData?.profileUrl
      ? userData?.profileUrl
      : NoProfile // Use default image if it's a group chat or if there's no profile image
  }
  alt=""
/>
            <div className="msg-detail">
              <div className="msg-username">
                {data.isGroupChat ? data.groupename : `${userData?.firstName} ${userData?.lastName}`}
              </div>
              <span>{online ? "Online" : "Offline"}</span>
            </div>
          </div>
        )}
      </div>
      <hr style={{ width: "100%", border: "0.5px solid #ececec" }} />
    </div>
  );
};

export default Conversation;
