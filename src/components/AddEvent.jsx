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
    setPicture(e.target.files[0]);
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
    <div className='fixed z-50 inset-0 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
        <div className='fixed inset-0 transition-opacity'>
          <div className='absolute inset-0 bg-[#000] opacity-70'></div>
        </div>

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
              Create Event
            </label>
          </div>
          <form
            className='px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6'
            onSubmit={handleSubmit(onSubmit)}
          >
            
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
<label
                className='flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer my-4'
                htmlFor='imgUpload'
              >
                <input
                  type='file'
                  className=''
                  id='imgUpload'
                  onChange={(e) => setFile(e.target.files[0])}
                  accept='.jpg, .png, .jpeg'
                />
              </label>

            {errMsg?.message && (
              <span className='text-sm text-red-500 mt-2'>{errMsg.message}</span>
            )}

            {isSubmitting ? (
              <Loading />
            ) : (
              <CustomButton
                type='submit'
                containerStyles={`inline-flex justify-center mb-5 rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
                title='Create Event'
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
