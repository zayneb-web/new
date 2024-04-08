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
    <div className="container mx-auto p-5 flex justify-center items-center h-full">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <h2 className="text-center text-2xl font-bold mb-4">Edit Event</h2>
        {loading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <TextInput
              name="title"
              label="Title"
              placeholder="Event Title"
              type="text"
              value={formData.title || ''}
              onChange={handleChange}
              className="mb-4"
            />
            <TextInput
              name="description"
              label="Description"
              placeholder="Event Description"
              type="text"
              value={formData.description || ''}
              onChange={handleChange}
              className="mb-4"
            />
            <TextInput
              name="date"
              label="Date"
              placeholder="Event Date"
              type="date"
              value={formData.date || ''}
              onChange={handleChange}
              className="mb-4"
            />
            <TextInput
              name="location"
              label="Location"
              placeholder="Event Location"
              type="text"
              value={formData.location || ''}
              onChange={handleChange}
              className="mb-4"
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <CustomButton
              type="submit"
              containerStyles={`w-full rounded-md bg-blue-500 hover:bg-blue-700 px-2 py-2 text-sm font-medium mt-5 text-white`}
              title="Update Event"
            />
          </form>
        )}
      </div>
    </div>
  );
}

export default EditEventForm;