import React from 'react';
import Sidebar from '../components/tasks/Sidebar';
import TopBar from '../components/TopBar';



const Task = () => {
  return (
    <>
    <TopBar/>
    <div className="w-full px-0 lg:px-10 pb-20 2xl:px-40 bg-bgColor lg:rounded-lg h-screen overflow-hidden">
       
        <div className="w-full flex gap-2 lg:gap-4 pt-2 h-full">
          <div className="hidden bg-white w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
          <Sidebar />
          </div>
        </div>
    </div>
    </>

  );
};

export default Task;