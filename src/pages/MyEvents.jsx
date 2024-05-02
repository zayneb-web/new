import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents, deleteEvent } from "../utils/api";
import Loading from "../components/Loading";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import EditEventForm from "../components/EditEventForm";
import { Link } from "react-router-dom";
import { MdDelete, MdEdit } from 'react-icons/md';

const MyEvents = () => {
  const { events, status, error } = useSelector((state) => state.event);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [editEventId, setEditEventId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false); // State variable to manage edit form visibility

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
        dispatch({ type: "DELETE_EVENT_SUCCESS", payload: eventId });
        console.log("Event deleted successfully!");
        window.location.reload();
      })
      .catch((error) => console.log('Error deleting event:', error));
  };

  const handleUpdate = (eventId) => {
    setEditEventId(eventId);
    setShowEditForm(true); // Show the edit form
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false); // Close the edit form
  };

  // Function to handle click outside event
  const modalRef = useRef(null);
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      handleCloseEditForm(); // Close the edit form when clicking outside of it
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <style>
        {`
          /* Style for the transparent background */
          .transparent-bg {
            background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999; /* Ensure it's above other elements */
          }

          /* Style for the edit form container */
          .edit-form-container {
            background-color: #fff; /* White background */
            width: 400px;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); /* Shadow effect */
          }
        `}
      </style>
      <TopBar />
      <div className="w-full min-h-screen bg-bgColor lg:rounded-lg overflow-hidden">
        <div className="w-full flex gap-2 lg:gap-4 pt-2 h-full ">
          <div className="hidden bg-white w-1/3 lg:w-1/4 h-[200px] md:flex flex-col gap-6 overflow-y-auto h-screen">
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
                    <div className="flex items-center gap-2 mt-5 justify-between">
                      <button onClick={() => handleDelete(event._id)} className="text-[#f64949fe]">
                        <MdDelete />
                      </button>
                      <button onClick={() => handleUpdate(event._id)} className="text-[#2ba150fe] block">
                        <MdEdit />
                      </button>
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
      {showEditForm && (
        <div className="transparent-bg">
          <div ref={modalRef} className="edit-form-container">
            <EditEventForm eventId={editEventId} onClose={handleCloseEditForm} />
          </div>
        </div>
      )}
    </>
  );
};

export default MyEvents;