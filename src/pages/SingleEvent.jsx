import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';

const SingleEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/event/getevent/${id}`);
        setEvent(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
            <TopBar />

      {/* Your CSS styles */}
      <div className='min-h-screen w-full px-0 lg:px-10 pb-20 2xl:px-10 bg-bgColor lg:rounded-lg h-screen overflow-hidden  '>        <div className='w-full flex gap-2 lg:gap-4 pt-2 h-full'>
          <div className='hidden bg-white w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto'>
            <Sidebar />
          </div>
          <div className='flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg bg-primary'>
            {event ? (
              <div className='p-4 rounded-md shadow-xl bg-secondary'>
                <img
                  src={event.image}
                  alt={event.title}
                  className='w-full h-auto rounded-md'
                  style={{ maxWidth: '100%', height: '400px' }} // Adjust height as needed
                />
                <div className='p-4'>
                  <h3 className='text-lg font-semibold'>{event.title}</h3>
                  <p className='text-sm text-gray-600'>{event.description}</p>
                  <p className='text-sm text-inline text-gray-500 mt-2'>📅 {new Date(event.date).toLocaleDateString()}</p>
                  <p className='text-sm text-gray-500 mt-2'>📍 {event.location}</p>
                  {/* Display other event details here */}
                </div>
              </div>
            ) : (
              <p>No event details found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleEvent;
