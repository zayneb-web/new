import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents, deleteEvent } from "../utils/api"; // Import fetchEvents and deleteEvent functions
import Loading from "../components/Loading";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import EditEventForm from "../components/EditEventForm"; // Import the EditEventForm component
import { Link } from "react-router-dom";
import { MdDelete, MdEdit } from 'react-icons/md';

const MyEvents = () => {
  const { events, status, error } = useSelector((state) => state.event);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [editEventId, setEditEventId] = useState(null); // State variable to track the event ID being edited

  useEffect(() => {
    fetchEvents(user?.token, dispatch)
      .then((data) => {
        dispatch({ type: "FETCH_EVENTS_SUCCESS", payload: data });
      })
      .catch((error) => dispatch({ type: "FETCH_EVENTS_FAILURE", payload: error }));
  }, [dispatch, user?.token]);

  const handleDelete = (eventId) => {
    deleteEvent(user?.token, eventId, dispatch)
      .then(() => {
        // Remove the deleted event from the events array in Redux state
        dispatch({ type: "DELETE_EVENT_SUCCESS", payload: eventId });
        console.log("Event deleted successfully!");
        // Reload the page after successful deletion
        window.location.reload();
      })
      .catch((error) => console.log('Error deleting event:', error));
  };

  const handleUpdate = (eventId) => {
    // Set the editEventId to the selected eventId
    setEditEventId(eventId);
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
        `}
      </style>

      <div className="w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
        <TopBar />
        <div className="w-full flex gap-2 lg:gap-4 pt-2 h-full">
          <div className="hidden bg-white w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
            <Sidebar />
          </div>
          <div className='flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg bg-primary pb-8'>
            {status === 'loading' && <Loading />}
            {status === 'idle' && Array.isArray(events) && events.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 mt-3">
                {events.map((event) => (
                  <div key={event._id} className="mt-5 p-4 rounded-md shadow-xl bg-secondary cursor-pointer transition-all duration-300">
                    <Link to={`/event/${event._id}`}>
                      <img src={event.image} alt={event.title} className="w-full h-auto rounded-md" style={{ maxWidth: "100%", height: "180px" }} />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <p className="text-sm text-inline text-gray-500 mt-2"> 📅 {new Date(event.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500 mt-2">📍 {event.location}</p>
                      </div>
                    </Link>
                    {/* Other event details */}
                    <div className="flex items-center gap-2 mt-5 justify-between">
                      <button onClick={() => handleDelete(event._id)} className="text-[#f64949fe]">
                        <MdDelete />
                      </button>
                      <Link to={`/edit-event/${event._id}`} className="text-[#2ba150fe] block">
                      <MdEdit />
                      </Link>
                    </div>
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
      {editEventId && (
        <EditEventForm
          eventId={editEventId}
          onClose={() => setEditEventId(null)} // Close the edit form
        />
      )}
    </>
  );
};

export default MyEvents;
