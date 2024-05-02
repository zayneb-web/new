  import React from "react";
  import { useSelector } from "react-redux";
  import { NoProfile } from "../assets";
  import { BiMessage } from "react-icons/bi";
  import { createChat } from "../utils/api";
  import { useNavigate } from "react-router-dom";

  const FriendsCard = ({ friends }) => {
    const currentUser = useSelector((state) => state?.user);
    console.log("Current User:", currentUser);
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleCreateChat = async (friendId, friendUser) => {
      try {
        // Extract the current user ID from the currentUser object
        const currentUserId = currentUser.user._id;
        // Check if current user and friend user are available
        if (currentUserId && friendUser) {
          // Call the createChat function with the sender's ID, receiver's ID, and user's token
          const res = await createChat(currentUserId, friendId, currentUser.token);
          console.log("Chat created successfully", res);
          // Navigate to the chat page after creating the chat
          navigate("/chat"); // Replace "/chat" with the actual path to the chat page
        } else {
          console.error("Current user or friend user is null or undefined");
        }
      } catch (error) {
        console.error("Error creating chat:", error);
      }
    };
    

    return (
      <div>
        <div className='w-full bg-primary shadow-sm rounded-lg px-6 py-5'>
          <div className='flex items-center justify-between text-ascent-1 pb-2 border-b border-[#66666645]'>
            <span> Friends</span>
            <span>{friends?.length}</span>
          </div>

          <div className='w-full flex flex-col gap-4 pt-4'>
            {friends?.map((friend) => (
              <div key={friend?._id} className='w-full flex gap-4 items-center'>
                <img
                  src={friend?.profileUrl ?? NoProfile}
                  alt={friend?.firstName}
                  className='w-10 h-10 object-cover rounded-full'
                />
                <div className='flex-1'>
                  <div className='flex items-center'>
                    <p className='text-base font-medium text-ascent-1'>
                      {friend?.firstName} {friend?.lastName}
                    </p>
                    {/* Call handleCreateChat with the friend's ID and user object */}
                    <BiMessage
                      className='ml-2 cursor-pointer'
                      onClick={() => handleCreateChat(friend._id, currentUser.user._id)} 
                    />
                  </div>
                  <span className='text-sm text-ascent-2'>
                    {friend?.profession ?? "No Profession"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  export default FriendsCard;
