import React, { useState, useEffect } from 'react';
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
import { useParams } from 'react-router-dom';
import { getCourseById, updateCourse, uploadFile } from '../../utils/api';

const UpdateCoursePage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    _id: '',
    title: '',
    description: '',
    file: null,
    image: null,
    price: 0,
    tags: [],
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('user');
    const jsonData = JSON.parse(token);
    // formData.tags = formData.tags.split(',');
    formData.createdBy = jsonData._id;
    getCourseById(jsonData.token, id).then((res) => {
      const { title, description, price, tags, _id } = res;
      console.log(res);
      setFormData({ title, description, price, tags: tags.join(','), _id });
    });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, file });
  };
  const handleImageChange = (e) => {
    const image = e.target.files[0];
    setImage(image);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your logic to create/update the course
    const token = localStorage.getItem('user');
    console.log(formData);
    formData.tags = formData.tags.split(',');
    uploadFile(file);
    uploadFile(image);
    console.log('file', file);
    console.log('image', image);
    updateCourse(token, {
      ...formData,
      file: formData.file.name,
      image: image.name,
    })
      .then((res) => {
        setMessage('Course updated successfully.');
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
      <TopBar />
      <div className="w-full min-h-screen bg-bgColor lg:rounded-lg overflow-hidden">  

      <div className="w-full flex gap-2 lg:gap-4 pt-2 h-full">
        <div className="hidden bg-white w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
          <Sidebar />
        </div>
        <div>
          <div className="flex justify-center items-center  bg-gray-100">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w[1000px] ml-20">
              <h2 className="text-2xl font-bold mb-4">Create Course</h2>

              <div className="mb-4">
                <img
                  src="https://foundr.com/wp-content/uploads/2023/04/How-to-create-an-online-course.jpg.webp"
                  alt="Course Image"
                  className="rounded-lg w[250px] h-64 object-cover"
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
                    className="bg-customColor hover:bg-[#f64949fe] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Create
                  </button>
                </div>
                {message && <h3 className="text-blue">{message} </h3>}
                {error && <h3 className="text-[#f64949fe] ">{error}</h3>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default UpdateCoursePage;
