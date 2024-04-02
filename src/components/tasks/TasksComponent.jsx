import axios from 'axios';
import {
  CalendarIcon,
  GroupIcon,
  LayoutGridIcon,
  ListIcon,
  TrashIcon,
} from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { set } from 'react-hook-form';

export default function TasksComponent({ openDialog }) {
  const [tasksInProgress, setTasksInProgress] = useState([]);
  const [tasksDone, setTasksDone] = useState([]);
  const [tasksToDo, setTasksToDo] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('user');
    const formattedToken = JSON.parse(token);
    const userId = formattedToken._id;
    console.log(userId);
    axios
      .get('http://localhost:5000/task/status/To_Do/' + userId)
      .then((res) => {
        setTasksToDo(res.data);
      });
    axios
      .get('http://localhost:5000/task/status/IN_PROGRESS/' + userId)
      .then((res) => {
        setTasksInProgress(res.data);
      });
    axios
      .get('http://localhost:5000/task/status/DONE/' + userId)
      .then((res) => {
        setTasksDone(res.data);
      });
  }, []);
  const updateTaskStatus = (id, status) => {
    axios.put(`http://localhost:5000/task/${id}/${status}`).then((res) => {
      console.log(res.data);
      if (status === 'To_Do') {
        setTasksToDo([...tasksToDo, res.data]);
        setTasksInProgress((prev) => {
          return prev.filter((task) => task._id !== res.data._id);
        });
      } else if (status === 'IN_PROGRESS') {
        setTasksInProgress([...tasksInProgress, res.data]);
        setTasksToDo((prev) => {
          return prev.filter((task) => task._id !== res.data._id);
        });
      } else if (status === 'DONE') {
        setTasksDone([...tasksDone, res.data]);
        setTasksInProgress((prev) => {
          return prev.filter((task) => task._id !== res.data._id);
        });
        setTasksToDo((prev) => {
          return prev.filter((task) => task._id !== res.data._id);
        });
      }
    });
  };
  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/task/${id}`).then((res) => {
      console.log(res.data);
      window.location.reload();
    });
  };
  return (
    <div className="max-w-7xl mx-auto p-6 h-full ml-0 w-full">
      <h1 className="text-3xl font-bold mb-4">Task List</h1>
      <div className="flex items-center space-x-4 mb-6">
        <button
          className="ml-auto bg-[#0c0a09] text-white px-4 py-2 rounded-md"
          onClick={() => openDialog()}
        >
          New
        </button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-[#d6191f]">To Do</h2>
            <span className="text-sm font-medium text-[#d6191f]">
              {tasksToDo.length}
            </span>
          </div>
          <div className="space-y-4">
            {tasksToDo.map((task) => {
              return (
                <div
                  className="bg-[#fecaca] p-4 rounded-md relative"
                  key={task.title}
                >
                  <p className="font-bold">{task.title}</p>
                  <p className="font-semibold text-sm text-[#27272a]">
                    {task.description}
                  </p>
                  <p className="text-sm text-[#525252]">
                    {' '}
                    {moment(task.deadline).format('MM/DD/YYYY')}
                  </p>
                  <div className="flex justify-between ">
                    <div>
                      <button
                        className="mt-2 bg-[#e5e7eb] text-[#525252] px-4 py-2 rounded-md mr-2"
                        onClick={() => updateTaskStatus(task._id, 'DONE')}
                      >
                        Done!
                      </button>
                      <button
                        className="mt-2 bg-[#e5e7eb] text-[#525252] px-4 py-2 rounded-md"
                        onClick={() =>
                          updateTaskStatus(task._id, 'IN_PROGRESS')
                        }
                      >
                        In Progress?
                      </button>
                    </div>
                    <button
                      className="absolute top-0 right-0 m-2"
                      onClick={() => deleteTask(task._id)}
                    >
                      <TrashIcon className="h-5 w-5 text-[#525252]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-[#0284c7]">
              In Progress
            </h2>
            <span className="text-sm font-medium text-[#0284c7]">
              {tasksInProgress.length}
            </span>
          </div>
          <div className="space-y-4">
            {tasksInProgress.map((task) => {
              return (
                <div
                  className="bg-[#dbeafe] p-4 rounded-md relative"
                  key={task._id}
                >
                  <p className="font-bold">{task.title}</p>
                  <p className="font-semibold text-sm text-[#27272a]">
                    {task.description}
                  </p>
                  <p className="text-sm text--[#a5b4fc]">
                    {moment(task.deadline).format('MM/DD/YYYY')}
                  </p>
                  <div className="flex justify-between">
                    <button
                      className="mt-2 bg-[#e5e7eb] text-[#525252] px-4 py-2 rounded-md hover:bg-gray hover:text-[#6b7280] transition-colors duration-200"
                      onClick={() => updateTaskStatus(task._id, 'DONE')}
                    >
                      Done!
                    </button>
                    <button
                      className="mt-2 bg-[#e5e7eb] text-[#525252] px-4 py-2 rounded-md hover:bg-gray hover:text-gray-800 transition-colors duration-200"
                      onClick={() => updateTaskStatus(task._id, 'To_Do')}
                    >
                      To Do!
                    </button>
                  </div>
                  <button
                    className="absolute top-0 right-0 m-2"
                    onClick={() => deleteTask(task._id)}
                  >
                    <TrashIcon className="h-5 w-5 text-[#525252]" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-[#16a34a]">Done</h2>
            <span className="text-sm font-medium text-[#16a34a]">
              {tasksDone.length}
            </span>
          </div>
          <div className="space-y-4">
            {tasksDone.map((task) => {
              return (
                <div
                  className="bg-[#dcfce7] p-4 rounded-md relative"
                  key={task._id}
                >
                  <p className="font-bold">{task.title}</p>
                  <p className="font-semibold text-sm text-[#27272a]">
                    {task.description}
                  </p>
                  <p className="text-sm text--[#525252]">
                    {' '}
                    {moment(task.deadline).format('MM/DD/YYYY')}
                  </p>
                  <button
                    className="absolute top-0 right-0 m-2"
                    onClick={() => deleteTask(task._id)}
                  >
                    <TrashIcon className="h-5 w-5 text-[#525252]" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
