import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { MdClose } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import TextInput from './TextInput';
import Loading from './Loading';
import CustomButton from './CustomButton';
import { updateEvent } from '../redux/eventSlice';
import { apiRequest } from '../utils/api';

const EditEventForm = ({ onClose, eventId }) => {
  const { events } = useSelector((state) => state.event);
  const dispatch = useDispatch();
  const [errMsg, setErrMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token, setToken] = useState('');
  
  // Define tagsInputRef, addTag, tags, removeTag, guestsInputRef, addGuest
  const tagsInputRef = useRef(null);
  const guestsInputRef = useRef(null);
  const [tags, setTags] = useState([]);
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    // Fetch data from sessionStorage
    const fetchDataFromSessionStorage = () => {
      const dataFromSessionStorage = localStorage.getItem("user");
      if (dataFromSessionStorage) {
        const userData = JSON.parse(dataFromSessionStorage);
        setToken(userData.token);
      }
    };
    
    fetchDataFromSessionStorage(); // Call the function to retrieve token
  }, []); // Empty dependency array since it's a one-time setup
  
  const handleClose = () => {
    onClose(); // Call onClose callback provided by the parent component
  };

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    mode: 'onChange',
    defaultValues: { ...events.find(event => event._id === eventId) },
  });

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const addTag = () => {
    const tagValue = tagsInputRef.current.value.trim();
    if (tagValue) {
      const tagColor = getRandomColor();
      setTags([...tags, { value: tagValue, color: tagColor }]);
      tagsInputRef.current.value = '';
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((tag, i) => i !== index));
  };

  const addGuest = () => {
    const guestValue = guestsInputRef.current.value.trim();
    if (guestValue) {
      setGuests([...guests, { value: guestValue }]);
      guestsInputRef.current.value = '';
    }
  };
  
  const removeGuest = (index) => {
    setGuests(guests.filter((guest, i) => i !== index));
  };
  
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrMsg('');
    try {
      const res = await apiRequest({
        url: `/event/updateevent/${eventId}`,
        data,
        method: 'PUT',
        // Assuming you have a token in your Redux state for authentication
        token: token,
      });

      if (res && res.message) {
        setErrMsg(res); // Assuming res.message contains error/success message
        if (res.status !== 'failed') {
          setTimeout(() => {
            onClose(); // Close the form after successful submission
          }, 3000);
        }
      } else {
        // Handle error response
        setErrMsg({ status: 'failed', message: 'Event Updated' });
      }
    } catch (error) {
      console.log(error);
      setErrMsg({ status: 'failed', message: 'An error occurred.' });
    }
    setIsSubmitting(false);
  };

  const formRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        handleClose(); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClose]); // Include handleClose in the dependency array to ensure correct closure

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
                htmlFor='name'
                className='block font-medium text-xl text-ascent-1 text-left'
              >
                Edit Event
              </label>

              <button className='text-ascent-1' onClick={handleClose}>
                <MdClose size={22} />
              </button>
            </div>
            <form
              className='px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6'
              onSubmit={handleSubmit(onSubmit)}
            >
            
              <TextInput
                name='title'
                label='Title'
                placeholder='Title'
                type='text'
                styles='w-full'
                register={register('title', {
                  required: 'Title is required!',
                })}
                error={errors.title ? errors.title?.message : ''}
              />

              <TextInput
                label='Description'
                placeholder='Description'
                type='text'
                styles='w-full'
                register={register('description', {
                  required: 'Description is required!',
                })}
                error={errors.description ? errors.description?.message : ''}
              />

              <TextInput
                name='date'
                label='Date'
                placeholder='Date'
                type='date'
                styles='w-full'
                register={register('date', {
                  required: 'Date is required!',
                })}
                error={errors.date ? errors.date?.message : ''}
              />

              <TextInput
                label='Location'
                placeholder='Location'
                type='text'
                styles='w-full'
                register={register('location', {
                  required: 'Location is required!',
                })}
                error={errors.location ? errors.location?.message : ''}
              />

              {/* Tags Input */}
              <div className='relative mb-6'>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add tags"
                    className="border-b border-gray-500 bg-transparent focus:outline-none flex-grow"
                    ref={tagsInputRef}
                  />
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none"
                    onClick={addTag}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 rounded-md flex items-center gap-1"
                      style={{ backgroundColor: tag.color, color: '#fff' }}
                    >
                      <span>{tag.value}</span>
                      <button
                        type="button"
                        className="text-sm focus:outline-none"
                        onClick={() => removeTag(index)}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Link Input */}
              <div className='relative mb-6'>
                <TextInput
                  name="link"
                  label="Link"
                  placeholder="Event Link"
                  type="text"
                  register={register("link")}
                  // Add any validation or error handling as needed
                />
              </div>

              {/* Guests Input */}
              <div className='relative mb-6'>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Enter guest emails"
                    className="border-b border-gray-500 bg-transparent focus:outline-none flex-grow"
                    ref={guestsInputRef}
                  />
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none"
                    onClick={addGuest}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {guests.map((guest, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 rounded-md flex items-center gap-1"
                    >
                      <span>{guest.value}</span>
                      <button
                        type="button"
                        className="text-sm focus:outline-none"
                        onClick={() => removeGuest(index)}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {errMsg?.message && (
                <span
                  role='alert'
                  className={`text-sm ${
                    errMsg?.status === 'failed'
                      ? 'text-[#2ba150fe]'
                      : 'text-[#2ba150fe]'
                  } mt-0.5`}
                >
                  {errMsg?.message}
                </span>
              )}

              <div className='py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]'>
                {isSubmitting ? (
                  <Loading />
                ) : (
                  <CustomButton
                    type='submit'
                    containerStyles={`inline-flex justify-center rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                    title='Submit'
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditEventForm;
