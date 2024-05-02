import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdClose } from 'react-icons/md';
import TextInput from './TextInput';
import Loading from './Loading';
import CustomButton from './CustomButton';
import FriendsList from "./FriendsList"
import { createGroupChat } from '../utils/api';

const Groupecard = ({ onClose }) => {

  const dispatch = useDispatch();
  const [errMsg, setErrMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]); // State to store selected friends
  const formRef = useRef(null);
  const currentUser = useSelector((state) => state?.user);
  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Extract the current user ID from the currentUser object
      const currentUserId = currentUser.user._id;
  
      const userIds = [...selectedFriends, currentUserId];
      console.log("Selected Friends:", selectedFriends);
      console.log("User IDs:", userIds);
      
      // Call createGroupChat function with the array of user IDs and group name
      await createGroupChat(userIds, groupName); 
      setGroupName('');
      setSelectedFriends([]);
      handleClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrMsg('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  const handleGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };
  const handleCheckboxChange = (friendId) => {
    console.log("Friend ID:", friendId);
    console.log("Selected Friends before:", selectedFriends);
    
    // Toggle friend selection
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter(id => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  
    console.log("Selected Friends after:", selectedFriends);
  };
  

  return (
    <>
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
                create groupe
              </label>

              <button className='text-ascent-1' onClick={handleClose}>
                <MdClose size={22} />
              </button>
            </div>
            <form
              className='px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6'
              onSubmit={handleSubmit}
            >
              <TextInput
                label='Group Name'
                placeholder='Enter group name'
                type='text'
                styles='w-full'
                id='group-name'
                value={groupName}
                onChange={handleGroupNameChange}
              />
              <div className="p-3 h-48 overflow-y-auto">
                <FriendsList
                  friends={currentUser.friends} // Pass the list of friends
                  selectedFriends={selectedFriends} // Pass the selected friends
                  onCheckboxChange={handleCheckboxChange} // Pass the checkbox change handler
                />
              </div>
              
              <div id="dropdownSearch" className="z-10 hidden bg-white rounded-lg shadow w-60 dark:bg-gray-700">
                {/* Your dropdown content here */}
              </div>
              <div className='py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]'>
                <CustomButton
                  type='submit'
                  containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                  title='Submit'
                  disabled={isSubmitting}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Groupecard;
