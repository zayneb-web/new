import React from "react";
import { FaGoogle } from "react-icons/fa"; // Import Google icon from React Icons

const GoogleButtom = ({ type, containerStyles, onClick, title }) => {
  return (
    <button
      type={type}
      className={containerStyles}
      onClick={onClick}
    >
      <FaGoogle className="mr-2" /> {/* Display Google icon */}
      {title}
    </button>
  );
};

export default GoogleButtom;