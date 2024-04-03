import React, { useState } from "react";
import { useEffect } from "react";
import { getUserInfo } from "../utils/api";
import { useSelector ,useDispatch} from "react-redux";
import { createChat } from "../utils/api";

const Conversation = ({ data, currentUser,online }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState(null);
  const user = useSelector((state) => state.user.user);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const fetchedUserData = await getUserInfo(user.token, data.members.find((id) => id !== currentUser)  );
        setUserData(fetchedUserData);
        console.log("fetchedUserData", fetchedUserData);
      } catch (error) {
        console.log(error);
      }
    };

    if (user && data) {
      fetchUserData();
 
    }
  }, [data, currentUser, user]);


  return (
<>
  <div className="conversation-area">
    <div className={`msg ${online ? "online" : "offline"}`}>
      <img
        className="msg-profile"
        src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%281%29.png"
        alt=""
      />
      <div className="msg-detail">
        <div className="msg-username">
          {userData?.firstName} {userData?.lastName}
        </div>
        <span>{online ? "Online" : "Offline"}</span>
      </div>
    </div>
  </div>
  <hr style={{ width: "100%", border: "0.5px solid #ececec" }} />
</>


  );
};

export default Conversation;