import { addStory } from "../../../utils/api";
import "./style.css"
import { useDispatch, useSelector } from "react-redux"; // Assuming you use Redux for state management
import React, { useState } from "react";
import { FaFontAwesome, FaPlus } from "react-icons/fa";
import "./style.css";


const Story = ({ type, data }) => {
    const [image, setImage] = useState(null); // State to store uploaded image
  
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      setImage(file);
    };
  
    const handleAddStory = async () => {
      // Assume userId and firstName are available in props or state
      const userId = "your_user_id";
      const firstName = "John Doe";
      const story_photo = "some_default_story_photo_url"; // Add default story photo URL
  
      const storyData = { userId, firstName, story_photo, image };
  
      try {
        const response = await addStory(storyData);
        console.log("Story added successfully:", response);
        // Add logic to handle successful story addition (e.g., show success message)
      } catch (error) {
        console.error("Error adding story:", error);
        // Add logic to handle error (e.g., show error message)
      }
    };
  
    return (
      <>

        {type === "new" ? (
          <div className="story new">
            <label htmlFor="file-upload" className="addIcon">
              <FaPlus />
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
            <span>Add Story</span>
          </div>
        ) : (
        
          <div className="story old">
            <div className="image-container">
              <img src={data.story_photo} alt="Story" />
            </div>
            <div className="user-details">
              <img src={data.photo} alt="User" />
            </div>
            <h3>{data.firstName}</h3>
          </div>
        )}
        {image && (
          <div className="story image-preview">
            <img src={URL.createObjectURL(image)} alt="Preview" />
          </div>
        )}
      </>
    );
  };
  
  export default Story;