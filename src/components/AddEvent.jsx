//addevent
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

const CreateEvent = ({ onClose }) => {
  const [errMsg, setErrMsg] = useState('');
  const { user } = useSelector((state) => state.user);
  const [picture, setPicture] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
  });

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
      const newData = uri ? { ...data, image: uri } : data;
      const res = await apiRequest({
        url: '/event/createevent',
        data: newData,
        token: user?.token,
        method: 'POST',
      });
      if (res?.status === 'failed') {
        setErrMsg(res);
      } else {
        setErrMsg(res);
        window.location.reload();
      }
      setIsSubmitting(false);
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
    }
  };

  const formRef = useRef(null);
  useOutsideClick(formRef, onClose);

  return (
    <>
    <div className='fixed z-50 inset-0 overflow-y-auto flex items-center justify-center'>
      <div className='absolute inset-0 bg-black opacity-70'></div>
      <div className='w-full max-w-md'>
        <div
          ref={formRef}
          className='bg-primary rounded-lg overflow-hidden shadow-xl p-8 relative'
          role='dialog'
          aria-modal='true'
          aria-labelledby='modal-headline'
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