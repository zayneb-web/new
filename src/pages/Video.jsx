import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const VideoPage = () => {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = useCallback(() => {
    console.log("Joining room:", value);
    navigate(`/room/${value}`);
  }, [navigate, value]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url('https://i.postimg.cc/XJ7PzZCm/Untitled-design-1.png')`,
        backgroundSize: 'cover',
      }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Join a Meeting</h2>
        <input
          className="border border-gray-300 p-2 rounded-md mb-4 w-full"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder='Enter Room Code'
        />
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 w-full"
          onClick={handleJoinRoom}
        >
          Join
        </button>
      </div>
    </div>
  );
};

export default VideoPage;
