import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import TopBar from "../components/TopBar";
import { MdOutlineAddTask } from "react-icons/md";
import { Link } from 'react-router-dom'; 
import CreateEvent from '../components/AddEvent'; 
import CreateEventButton from "./calendar/CreateEventButton";
import SmallCalendar from '../components/calendar/SmallCalendar'; 
import EventPopup from './EventPopup'; 
import axios from 'axios'; 
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent } from "../utils/api";

const localizer = momentLocalizer(moment);

function EventCalendar() {
  const [showCreateEvent, setShowCreateEvent] = useState(false); 
  const [events, setEvents] = useState([]); 
  const [selectedEvent, setSelectedEvent] = useState(null); // State to hold selected event details
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/event/getevents'); 
      setEvents(response.data.data); 
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSelectSlot = (slotInfo) => {
    setShowCreateEvent(true);
  };

  const handleCreateEventClick = () => {
    setShowCreateEvent(true);
  };

  const handleDeleteEvent = (event) => {
    if (event && event.id) { 
      deleteEvent(user?.token, event.id, dispatch)
        .then(() => {
          setEvents(prevEvents => prevEvents.filter(item => item._id !== event.id));
          console.log("Event deleted successfully!");
        })
        .catch((error) => console.log('Error deleting event:', error));
    } else {
      console.log('Error: Invalid event or event ID');
    }
  };

  const handleEventClick = (event, e) => {
    setSelectedEvent({ ...event, x: e.pageX, y: e.pageY });
  };
  
  // Implementing onClose function to close the Popup
  const handleClosePopup = () => {
    setSelectedEvent(null);
  };
  
  

  return (
    <>
      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ flex: '0 0 250px', backgroundColor: '#ffff', borderRadius: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', padding: '30px' }}>
          <CreateEventButton onClick={handleCreateEventClick} />
          <div style={{ marginTop: '20px' }}>
            <SmallCalendar />
          </div>
        </div>
        <div style={{ flex: '1', padding: '20px' }}>
          <Navbar bg="dark" data-bs-theme="dark">
            <Container>
              <Link to="/Event" className="flex items-center gap-2 ">
                <MdOutlineAddTask className="text-[#D00000] text-4xl" />
                <h1 className="text-3xl font-bold text-black">Events Calendar</h1>
              </Link>
            </Container>
          </Navbar>
          <div className="EventCalendar" style={{ padding: '14px', position: 'fixed', width: '80%' }}>
            <Calendar
              localizer={localizer}
              selectable
              onSelectSlot={handleSelectSlot} 
              onSelectEvent={handleEventClick} // Call handleEventClick when an event is clicked
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
              startAccessor="start"
              events={events.map(event => ({
                ...event,
                start: new Date(event.date),
                end: new Date(event.date), 
                color: event.color, 
                id: event._id 
              }))} 
              endAccessor="end" 
              style={{ height: 'calc(100vh - 120px)' }} 
              eventPropGetter={(event) => ({
                style: {
                  backgroundColor: event.color, 
                },
              })}
            />
          </div>
        </div>
      </div>
      {showCreateEvent && <CreateEvent onClose={() => setShowCreateEvent(false)} />}
      {selectedEvent && (
  <EventPopup 
    event={selectedEvent} 
    onDelete={handleDeleteEvent} 
    onClose={handleClosePopup} // Pass handleClosePopup function
  />
)}

    </>
  );
}

export default EventCalendar;
