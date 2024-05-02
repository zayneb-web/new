import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import TextInput from '../components/TextInput';
import CustomButton from '../components/CustomButton';
import { apiRequest, uploadImage } from '../utils/api';
import Loading from '../components/Loading';
import { BiImages } from 'react-icons/bi';

const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};
//
const CreateEvent = ({ onClose }) => {
  const [errMsg, setErrMsg] = useState('');
  const { user } = useSelector((state) => state.user);
  const [picture, setPicture] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState([]); // State for storing tags
  const [guests, setGuests] = useState([]); 

  const tagsInputRef = useRef(null);
  const guestsInputRef = useRef(null);

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Add setValue from useForm
  } = useForm({
    mode: 'onChange',
  });

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleSelect = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
  
    try {
      const uri = file && (await uploadImage(file));
      const newData = uri ? { ...data, image: uri, tags: tags.map(tag => tag.value), guests: guests.map(guest => guest.value) } : { ...data, tags: tags.map(tag => tag.value), guests: guests.map(guest => guest.value) };
      const res = await apiRequest({
        url: '/event/createevent',
        data: newData,
        token: user?.token,
        method: 'POST',
      });
      if (res?.status === 'failed') {
        setErrMsg(res);
      } 
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };
  

   const addTag = () => {
    const tagValue = tagsInputRef.current.value.trim();
    if (tagValue) {
      // Generate a random color for the tag
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
  
  const formRef = useRef(null);
  useOutsideClick(formRef, onClose);

  return (
    <>
    <div className='fixed inset-0 overflow-y-auto flex items-center justify-center'>
        <div className='absolute inset-0 bg-black opacity-70'></div>
        <div className='w-full max-w-md'>
          <div
            ref={formRef}
            className='bg-white rounded-lg overflow-y-auto shadow-xl p-8 relative'
            role='dialog'
            aria-modal='true'
            aria-labelledby='modal-headline'
            style={{ maxHeight: '80vh' }} 
          >
          <h2 className='text-2xl font-bold text-ascent-1 mb-8 text-center'>Create Event</h2>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='relative mb-6'>
              <TextInput
                name="title"
                label="Title"
                placeholder="Event Title"
                type="text"
                register={register("title", {
                  required: "Title is required!",
                })}
                error={errors.title ? errors.title?.message : ""}
              />
            </div>

            <div className='relative mb-6'>
              <TextInput
                name="description"
                label="Description"
                placeholder="Event Description"
                type="text"
                register={register("description", {
                  required: "Description is required!",
                })}
                error={errors.description ? errors.description?.message : ""}
              />
            </div>

            <div className='relative mb-6'>
              <TextInput
                name="date"
                label="Date"
                placeholder="Event Date"
                type="date"
                register={register("date", {
                  required: "Date is required!",
                })}
                error={errors.date ? errors.date?.message : ""}
              />
            </div>

            <div className='relative mb-6'>
              <TextInput
                name="location"
                label="Location"
                placeholder="Event Location"
                type="text"
                register={register("location", {
                  required: "Location is required!",
                })}
                error={errors.location ? errors.location?.message : ""}
              />
            </div>

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
            

            <div className='flex items-center gap-4 mt-4'>
              <label className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer'>
                <BiImages className="text-ascent-1" />
                <input
                  type='file'
                  className='hidden'
                  onChange={handleSelect}
                  accept='.jpg, .png, .jpeg'
                />
              </label>
              {imageUrl && (
                <img src={imageUrl} alt="Selected" className="w-20 h-20 rounded-lg" />
              )}
              {errMsg?.message && (
                <span className='text-sm text-red-500'>{errMsg.message}</span>
              )}
            </div>

            <div className='mt-6 flex justify-center'>
              {isSubmitting ? (
                <Loading />
              ) : (
                <CustomButton
                  type='submit'
                  containerStyles='w-full max-w-xs bg-blue text-white py-2 px-4 rounded-lg font-bold shadow-md hover:bg-blue-dark'
                  title='Create Event'
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

export default CreateEvent;
