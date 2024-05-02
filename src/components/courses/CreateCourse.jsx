import React, { useState } from 'react';
import {
  MdTitle,
  MdDescription,
  MdAttachFile,
  MdAttachMoney,
  MdLabel,
  MdImage,
} from 'react-icons/md';
import TopBar from '../TopBar';
import Sidebar from './sidebar';

import { addcourse, uploadFile } from '../../utils/api';

const CreateCoursePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
    image: null,
    price: 0,
    tags: [],
    createdBy: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };
  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setImage(image);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('user');
    const jsonData = JSON.parse(token);
    formData.tags = formData.tags.split(',');
    formData.createdBy = jsonData._id;
    uploadFile(file)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
    uploadFile(image);
    addcourse(token.token, { ...formData, file: file.name, image: image.name })
      .then((res) => {
        setMessage('Course created successfully.');
        setError('');
        setFormData({
          title: '',
          description: '',
          file: '',
          price: 0,
          tags: [],
          createdBy: '',
        });
      })
      .catch((error) => {
        setMessage('');
        setError('Something went wrong. Please try again.');

        console.log(error);
      });
  };

  return (
    <>
    <style>
      {`
      .sidebar {
       
        width: 20%; /* Adjust width as needed */
       
        padding: 10px; /* Add padding */
      }

      `}
    </style>
      <TopBar />
      <div className="flex">
        
        <div className='sidebar'><Sidebar /></div>
        
        <div className="flex justify-center items-center bg-white min-h-screen w-full">
          <div className="w-full max-w-[700px] p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Create Course</h2>

            <div className="mb-4 mx-auto max-w-md">
              <img
                src="https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg.webp"
                alt="Course Image"
                className="rounded-lg w-full h-auto max-h-64 object-cover"
              />
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4 flex items-center">
                  <MdTitle className="text-blue mr-2" />
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <MdDescription className="text-blue mr-2" />
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <MdAttachFile className="text-blue mr-2" />
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="file"
                    accept=".pdf"
                    name="file"
                    onChange={handleFileChange}
                    required
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <MdImage className="text-blue mr-2" />
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    name="image"
                    onChange={handleImageChange}
                    required
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <MdAttachMoney className="text-blue mr-2" />
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="number"
                    placeholder="Price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <MdLabel className="text-blue mr-2" />
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    placeholder="Tags (comma separated)"
                    name="tags"
                    // value={formData.tags.join(',')}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="flex items-center justify-end">
                  <button
                    className="bg-[#D00000] hover:bg-[#D00000] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Create
                  </button>
                </div>
                {message && <h3 className="text-blue">{message} </h3>}
                {error && <h3 className="bg-[#D00000] ">{error}</h3>}
                </form>
            {message && <h3 className="text-blue">{message} </h3>}
            {error && <h3 className="bg-red-500 text-white py-2 px-4 rounded">{error}</h3>}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCoursePage;
