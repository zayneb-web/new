import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { MdOutlineAddTask } from "react-icons/md";
import { Event } from '../pages';
import { Link } from 'react-router-dom'; 

const localizer = momentLocalizer(moment);

function EventCalendar() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events data from backend when the component mounts
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/event/getevents'); // Adjust the API endpoint URL as needed
      setEvents(response.data.data); // Assuming the response contains events data
    } catch (error) {
      console.error('Error fetching events:', error);
      // Handle error
    }
  };

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
        <Link to="/Event" className="flex items-center gap-2">
          <MdOutlineAddTask className="text-[#D00000] text-4xl" />
          <h1 className="text-3xl font-bold text-black">Events Calendar</h1>
        </Link>
        </Container>
      </Navbar>
      <div className="EventCalendar" style={{ padding: '14px' }}>
        <Calendar
          localizer={localizer}
          startAccessor="start"
          events={events.map(event => ({
            title: event.title,
            start: new Date(event.date),
            end: new Date(event.date), // Assuming events last for one day
            color: event.color, // Adjust as needed
          }))}
          endAccessor="end"
          style={{
            height: '600px',
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.color, // Adjust as needed
            },
          })}
          onSelectEvent={(event) => alert(event.title)}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        />
      </div>
    </>
  );
}

export default EventCalendar;