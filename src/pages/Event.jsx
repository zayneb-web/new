import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents, likeEvent as likeEventAPI } from "../utils/api"; 
import Loading from "../components/Loading";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import { BiLike, BiSolidLike } from "react-icons/bi";
import axios from "axios"; 

const Event = ({ searchResults }) => {
  const { events, status, error } = useSelector((state) => state.event);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [topEvents, setTopEvents] = useState([]);

  useEffect(() => {
    // Fetch top three most popular events from Django backend
    axios.get("http://localhost:8000/predict_top_events/")
      .then((response) => {
        setTopEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching top events:", error);
      });
  }, []);
  useEffect(() => {
    fetchEvents(user?.token, dispatch)
      .then((data) => {
        dispatch({ type: "FETCH_EVENTS_SUCCESS", payload: data });
      })
      .catch((error) => dispatch({ type: "FETCH_EVENTS_FAILURE", payload: error }));
  }, [dispatch, user?.token]);

  // Function to handle liking an event
  const likeEvent = async (eventId) => {
    try {
      await axios.post(`http://localhost:5000/event/likeevent/${eventId}`, null, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      // Refetch events after liking an event to get the latest data
      fetchEvents(user.token, dispatch)
        .then((data) => {
          dispatch({ type: "FETCH_EVENTS_SUCCESS", payload: data });
        })
        .catch((error) => dispatch({ type: "FETCH_EVENTS_FAILURE", payload: error }));
    } catch (error) {
      // Handle error
      console.error("Error liking event:", error);
    }
  };

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

          /* CSS for Sidebar */
          .sidebar {
            position: fixed;
            top: 10;
            left: 2;
            right: 4;
            height: 100%;
            width: 22%; /* Adjust width as needed */
            overflow-y: auto; /* Add scrollbar when content exceeds height */
            background-color: #ffffff; /* Sidebar background color */
            z-index: 1000; /* Ensure it's above other content */
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Add shadow */
            padding: 10px; /* Add padding */
          }

          .sidebar::-webkit-scrollbar {
            width: 8px; /* Width of scrollbar */
          }

          .sidebar::-webkit-scrollbar-thumb {
            background-color: #ccc; /* Color of scrollbar thumb */
            border-radius: 4px; /* Border radius of scrollbar thumb */
          }

          /* Adjust events section to avoid overlap with sidebar */
          .events-section {
            margin-left: 23%; /* Set margin equal to the width of the sidebar */
          }
          
          /* CSS for bold title */
          .bold-title {
            font-weight: bold;
            text-align: left;
            margin-top: 11px;
            padding: 25px
            margin-bottom: 10px; /* Add margin bottom to create space */
            font-size: 24px; /* Larger font size */
            color: #2F4F4F;
          }
          
          /* CSS for separating line */
          .separator-line {
            border-top: 1px solid #ccc;
            margin-bottom: 10px; /* Add margin bottom to create space */
          }
          
          /* CSS for big-size event */
          .big-size-event {
            font-size: 20px; /* Larger font size */
            width: 100%; /* Take full width */
          }

        `}
      </style>
      <TopBar />
      <div className="w-full min-h-screen bg-bgColor lg:rounded-lg overflow-hidden">
        <div className="w-full flex gap-2 lg:gap-4 pt-2 h-full ">
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className="events-section flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg bg-primary pb-2 mt-2 ">
            {status === "loading" && <Loading />}
            {topEvents.length > 0 && (
              <>
                <h1 className="bold-title">Top Three Most Popular Events</h1>

                <div className="grid grid-cols-3 gap-4 p-4">
                  {topEvents.map((event, index) => (
                    <div
                      key={index}
                      className="mt-0 p-4 rounded-md shadow-xl bg-secondary cursor-pointer transition-all duration-300 big-size-event"
                    >
                      <div key={index}>
                        <img src={event.image} alt={event.title} className="w-full h-auto rounded-md" style={{ maxWidth: "100%", height: "180px" }} />
                        <div className="p-4">
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <p className="text-sm text-gray-600">{event.description}</p>
                          <p className="text-sm text-inline text-gray-500 mt-2"> 📅 {new Date(event.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500 mt-2">📍 {event.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
              
            )}
            {status === "idle" && Array.isArray(events) && events.length > 0 ? (
              <>
              <h1 className="bold-title">All Events </h1>
              <div className="grid grid-cols-3 gap-4">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="mt-5 p-4 rounded-md shadow-xl bg-secondary cursor-pointer transition-all duration-300"
                  >
                    <div key={event._id}>
                      <img src={event.image} alt={event.title} className="w-full h-auto rounded-md" style={{ maxWidth: "100%", height: "180px" }} />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <p className="text-sm text-inline text-gray-500 mt-2"> 📅 {new Date(event.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500 mt-2">📍 {event.location}</p>
                        <button onClick={() => likeEvent(event._id)}>
                          {event.likes && Array.isArray(event.likes) && event.likes.includes(user?._id) ? (
                            <BiSolidLike size={20} color='blue' />
                          ) : (
                            <BiLike size={20} />
                          )}
                          {event.likes && Array.isArray(event.likes) ? event.likes.length : 0} Likes
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              </>
            ) : (
              <p>No events found.</p>
            )}
            {status === "idle" && error && <p>Error: {error.message}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Event;
