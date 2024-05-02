import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { NoProfile } from "../assets";
import { createGroupChat } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { MdClose } from 'react-icons/md';

const FriendsList = ({ onClose }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [selectedFriends, setSelectedFriends] = useState([]); // State to store selected friends
  const [groupename, setGroupename] = useState(''); // State to store group name
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage form submission
  const [errMsg, setErrMsg] = useState(''); // State to store error message
  const formRef = useRef(null);

  const handleGroupenameChange = (e) => {
    setGroupename(e.target.value);
    console.log(e.target.value);
  };

  useEffect(() => {
    console.log("Selected Friends:", selectedFriends);
  }, [selectedFriends]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Extract the current user ID from the user object
      const currentUserId = user._id;
      // Include the current user's ID in the list of selected friends
      const userIds = [...selectedFriends.map(friendId => friendId), currentUserId];
      // Call createGroupChat function with the array of user IDs and group name
      const newChat = await createGroupChat(userIds, groupename); 
      // Update UI with the newly created chat data
      console.log("group name", groupename); // Log the group name here

      setGroupename(''); // Clear the group name input
      setSelectedFriends([]);
      handleClose();
      window.location.reload();

    } catch (error) {
      console.error('Error submitting form:', error);
      setErrMsg('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCheckboxChange = (friendId) => {
    // Check if the friendId is already in selectedFriends array
    const isSelected = selectedFriends.includes(friendId);
    if (isSelected) {
      // If the friendId is already selected, remove it from the array
      setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    } else {
      // If the friendId is not selected, add it to the array
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className='fixed z-50 inset-0 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity'>
          <div className='absolute inset-0 bg-[#000] opacity-70'></div>
        </div>
        <span className='hidden sm:inline-block sm:align-middle sm:h-screen'></span>
        &#8203;
        <div
          ref={formRef}
          className='inline-block align-bottom bg-primary rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
          role='dialog'
          aria-modal='true'
          aria-labelledby='modal-headline'
        >
          <div className='flex justify-between px-6 pt-5 pb-2'>
            <label
              htmlFor='group-name'
              className='block font-medium text-xl text-ascent-1 text-left'
            >
              Create Group
            </label>
            <button className='text-ascent-1' onClick={handleClose}>
              <MdClose size={22} />
            </button>
          </div>
          <form
            className='px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6'
            onSubmit={handleSubmit}
          >
            <input
              label='Group Name'
              placeholder='Enter group name'
              type='text'
              className='w-full'
              id='group-name'
              value={groupename}
              onChange={handleGroupenameChange}
            />
            <div className="p-3 h-48 overflow-y-auto">
              <div className='w-full pb-2 border-b border-[#66666645]'>
                <div className='flex justify-between px-6 pt-5 pb-2'></div>
                <h1>Select Friends</h1>
                {user.friends?.map((friend) => (
                  <div key={friend._id} className='bg-primary shadow-sm rounded-lg px-3 py-3 mb-3 flex items-center'>
                    <input
                      type="checkbox"
                      checked={selectedFriends.includes(friend._id)}
                      onChange={() => handleCheckboxChange(friend._id)}
                      className="mr-3"
                    />
                    <img
                      src={friend?.profileUrl ?? NoProfile}
                      alt={friend?.firstName}
                      className='w-10 h-10 object-cover rounded-full mr-3'
                    />
                    <div>
                      <p className='text-base font-medium text-ascent-1'>
                        {friend?.firstName} {friend?.lastName}
                      </p>
                      <p className='text-sm text-ascent-2'>{friend?.profession ?? "No Profession"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            
            <div className='py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]'>
              <button
                type='submit'
                className={`inline-flex justify-center rounded-md bg-blue-500 px-8 py-3 text-sm font-medium text-white outline-none`}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
