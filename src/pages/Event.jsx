import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents, searchEvents } from "../utils/api";
import Loading from "../components/Loading";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const Event = () => {
  const { events, status, error } = useSelector((state) => state.event);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
 

  useEffect(() => {
    fetchEvents(user?.token, dispatch)
      .then((data) => {
        dispatch({ type: "FETCH_EVENTS_SUCCESS", payload: data });
        
      })
      .catch((error) => dispatch({ type: "FETCH_EVENTS_FAILURE", payload: error }));
  }, [dispatch, user?.token]);

 
  return (
    <>
      <style>
        {`
          /* CSS for Event component */
          /* Add these styles to your existing CSS file or component */

          /* Style for the transparent blue hover effect */
          .bg-secondary {
            background-color: primary; /* Default background color */
            transition: background-color 0.3s ease; /* Smooth transition */
          }

          /* Hover effect */
          .bg-secondary:hover {
            background-color: #e6f2ff; /* Transparent blue color on hover */
          }

          /* Style for pagination buttons */
          .pagination-container {
            display: flex;
            justify-content: center;
            margin-top: 20px;
          }

          .pagination-container button {
            margin: 0 5px;
            padding: 5px 10px;
            cursor: pointer;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #fff;
          }

          .pagination-container button.active {
            background-color: #e6f2ff; /* Active page background color */
          }
          /* Style for pagination buttons */
          .pagination-container {
            display: flex;
            justify-content: center;
            margin-top: 20px;
          }

          .pagination-container button {
            margin: 0 5px;
            padding: 5px 10px;
            cursor: pointer;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #fff;
          }

          .pagination-container button.active {
            background-color: #e6f2ff; /* Active page background color */
          }
        `}
      </style>
      <TopBar />
      <div className="w-full min-h-screen bg-bgColor lg:rounded-lg overflow-hidden">
      <div className="w-full flex gap-2 lg:gap-4 pt-2 h-full ">
        <div className="hidden bg-white w-1/3 lg:w-1/4 h-[200px] md:flex flex-col gap-6 overflow-y-auto h-screen">
            <Sidebar />
          </div>
          
          <div className='flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg bg-primary pb-6'>
            {status === 'loading' && <Loading />}
            {status === 'idle' && Array.isArray(events) && events.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {events.map((event) => (
                  
                  <div
                    key={event._id}
                    className="mt-5 p-4 rounded-md shadow-xl bg-secondary cursor-pointer transition-all duration-300"
                  >
                    <Link key={event._id} to={`/event/${event._id}`}>
                    <img src={event.image} alt={event.title} className="w-full h-auto rounded-md" style={{maxWidth: "100%", height: "180px"}} />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{event.title}</h3>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      
                      <p className="text-sm text-inline text-gray-500 mt-2"> 📅 {new Date(event.date).toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500 mt-2">📍 {event.location}</p>
                    </div>
                    </Link>

                  </div>
                 
                ))}
                
        </div>
           
              
            ) : (
              <p>No events found.</p>
            )}
            {status === 'idle' && error && <p>Error: {error.message}</p>}
            
          </div>
        </div>
        
       </div>
      
      
    </>
  );
};

export default Event;
