// Chaptersidebar.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BsPersonFillAdd } from "react-icons/bs";
import CreateButton from "../chapters/CreateButton";
import AddChapterForm from "./AddChapter";
import ChapterDetails from "./ChapterDetails"
import axios from "axios";

const Chaptersidebar = ({ user }) => {
  const [chapters, setChapters] = useState([]);
  const [showAddChapterForm, setShowAddChapterForm] = useState(false);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/chapter/getallchapter`);
        setChapters(response.data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchChapters();
  }, []);

  const toggleAddChapterForm = () => {
    setShowAddChapterForm(!showAddChapterForm);
  };

  return (
    <div className="w-full bg-primary flex flex-col items-center shadow-sm rounded-xl px-6 py-4">
      <div className="w-full max-w-screen-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="text-ascent-2">
            <CreateButton onClick={toggleAddChapterForm} />
          </div>
        </div>
        <div className="overflow-auto max-h-96">
          <div className="w-full flex flex-wrap">
            {chapters.map((chapter) => (
              <Link to={`/chapterdetails/${chapter._id}`} key={chapter._id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-4 px-2">
                <div className="rounded-md shadow-xl bg-secondary p-4 h-full">
                  <img
                    src={chapter.chapterImage}
                    alt={chapter.chapterName}
                    className="w-full h-32 object-cover rounded-md mb-4"
                  />
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">{chapter.chapterName}</h3>
                    <p className="text-sm text-gray-600">{chapter.chapterDescription}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      {showAddChapterForm && (
        <AddChapterForm onClose={toggleAddChapterForm} />
      )}
    </div>
  );
};

export default Chaptersidebar;
