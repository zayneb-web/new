import React, { useState } from 'react';
import TopBar from '../TopBar';
import Sidebar from './Sidebar';
import TasksComponent from './TasksComponent';
import * as Dialog from '@radix-ui/react-dialog';
import { CalendarIcon } from 'lucide-react';
import axios from 'axios';
import { MdDashboard } from 'react-icons/md';
const linkData = [
  {
    label: 'Dashboard',
    link: 'tasks',
    icon: <MdDashboard />,
  },
];

const TasksList = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
  });

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const token = localStorage.getItem('user');
    const formattedToken = JSON.parse(token);
    console.log(formattedToken);
    axios
      .post('http://localhost:5000/task', {
        ...formData,
        createdBy: formattedToken._id,
      })
      .then((res) => {
        console.log(res.data);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });

    setFormData({
      title: '',
      description: '',
      dueDate: '',
    });
    closeDialog(); // Close the dialog after form submission
  };

  return (
    <>
    <TopBar />
    <div className="w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-full ">
  
      <div className="w-full flex gap-2 lg:gap-4 pt-2 h-full ">
        <div>
          <div className="flex justify-center  bg-white h-full w-[76rem] mt-2">
            <TasksComponent openDialog={openDialog} />
          </div>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 flex justify-center items-center bg-[#e5e7eb] bg-opacity-50 z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Task Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter task description"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Due Date
                </label>
                <div className="flex items-center mt-1">
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                  <CalendarIcon className="h-5 w-5 text-gray-400 ml-2" />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#ff6347] text-white px-4 py-2 rounded-md hover:bg-[#f87171]"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-300"
                  onClick={closeDialog}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default TasksList;
