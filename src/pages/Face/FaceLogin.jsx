import React, { useEffect, useRef } from 'react';
const FaceLogin = () => {
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const nameInputRef = useRef(null);
  
    useEffect(() => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const nameInput = nameInputRef.current;
  
      // Rest of the code...
    }, []);
  
    const capture = () => {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      canvasRef.current.style.display = 'block';
      videoRef.current.style.display = 'none';
    };
  
    const register = () => {
      const name = nameInputRef.current.value;
      // Rest of the code...
    };
  
    const login = () => {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      // Rest of the code...
    };
  
    const dataURItoBlob = (dataURI) => {
      // Rest of the code...
    };
  
    return (
      <div>
        <video id="video" width="440" height="280" ref={videoRef} autoPlay></video>
        <br />
  
        <button onClick={capture}>YOU CAPTURE PHOTO FACE</button>
        <br />
        <canvas
          id="canvas"
          width="400"
          height="280"
          style={{ display: 'none' }}
          ref={canvasRef}
        ></canvas>
        <br />
        <h3>REGISTER ACCOUNT</h3>
        <label htmlFor="name">Your name: </label>
        <input type="text" id="name" required ref={nameInputRef} />
        <br />
        <button onClick={register}>REGISTER</button>
        <button onClick={login}>login now</button>
      </div>
    );
  };
  
  export default FaceLogin;