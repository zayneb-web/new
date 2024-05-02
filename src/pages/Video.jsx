import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './VideoPage.css';


const VideoPage = () => {
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const handleJoinRoom = useCallback(() => {
    console.log("Joining room:", value);
    navigate(`/room/${value}`);
  }, [navigate, value]);

  return (
    <div className="video-page-container">
      <div className="video-page-content">
        <h2 className="mb-5">Join a Meeting</h2>
        <input
          className="room-code-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          placeholder='Enter Room Code'
        />
        <button className="join-button" onClick={handleJoinRoom}>Join</button>
      </div>
    </div>
  );
};

export default VideoPage;
