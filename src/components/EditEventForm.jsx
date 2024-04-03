import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TextInput from '../components/TextInput';
import CustomButton from '../components/CustomButton';
import Loading from '../components/Loading';
import { useParams } from 'react-router-dom';
import { updateEvent } from '../utils/api';

function EditEventForm() {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch event data using eventId and update formData
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/event/getevent/${id}`);
        setFormData(response.data); // Assuming the API response includes event data
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(error.message);
      }
    };
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('user');
    console.log(formData);
  
    if (typeof formData.tags === 'string') {
      formData.tags = formData.tags.split(',');
    }
  
    updateEvent(token, {
      ...formData,
    })
      .then((res) => {
        setMessage('Event updated successfully.');
        setError('');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((error) => {
        setMessage('');
        setError('Something went wrong. Please try again.');
      });
  };
  

  return (
    <>
      <style>
        {`
          /* CSS for EditEventForm component */
          /* Add these styles to your existing CSS file or component */
          .form-container {
            /* Add your styles for form container */
          }
          .error-message {
            /* Add your styles for error message */
          }
        `}
      </style>

      <div className="form-container">
        <h2>Edit Event</h2>
        {loading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit}>
            <TextInput
              name="title"
              label="Title"
              placeholder="Event Title"
              type="text"
              value={formData.title || ''}
              onChange={handleChange}
            />
            <TextInput
              name="description"
              label="Description"
              placeholder="Event Description"
              type="text"
              value={formData.description || ''}
              onChange={handleChange}
            />
            <TextInput
              name="date"
              label="Date"
              placeholder="Event Date"
              type="date"
              value={formData.date || ''}
              onChange={handleChange}
            />
            <TextInput
              name="location"
              label="Location"
              placeholder="Event Location"
              type="text"
              value={formData.location || ''}
              onChange={handleChange}
            />
            {/* Add other input fields for event data */}
            {error && <p className="error-message">Error: {error}</p>}
            <CustomButton
              type="submit"
              containerStyles={`inline-flex justify-center mb-5 rounded-md bg-blue px-8 py-3 text-sm font-medium text-white outline-none`}
              title="Update Event"
            />
          </form>
        )}
      </div>
    </>
  );
}

export default EditEventForm;
