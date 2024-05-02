import React, { useState } from "react";
import axios from "axios"; // Assurez-vous d'importer Axios ou utilisez fetch

const UpdateComment = ({ commentId, initialComment, onUpdateSuccess, onUpdateError }) => {
  const [comment, setComment] = useState(initialComment);

  const handleUpdateComment = async () => {
    try {
      const response = await axios.put(`/posts/update-comment/${commentId}`, { comment });
      const updatedComment = response.data.data;
      onUpdateSuccess(updatedComment);
    } catch (error) {
      console.error("Error updating comment:", error);
      onUpdateError(error.message);
    }
  };

  return (
    <div>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <button onClick={handleUpdateComment}>Update Comment</button>
    </div>
  );
};

export default UpdateComment;
