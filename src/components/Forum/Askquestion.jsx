import React from "react";
import axios from "axios";
import { BiAdd, BiShare } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import TopBar from "../TopBar"

const Askquestion = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, tags } = e.target;
    const question = {
      question: title.value,
      description: description.value,
      tags: tags.value.split(","),
      userId: user._id,
    };

    const res = await axios.post(
      "http://localhost:5000/forum/ask-question",
      question
    );
    if (res.status === 201) {
      toast.success("Question added successfully", { duration: 2000 });
      setTimeout(() => {
        navigate("/forum");
      }, 2000);
    }
  };

  return (
    <>
    <TopBar/>
    <div className="flex justify-center items-center h-screen">
      <Toaster />
      <div className="w-full md:w-[50%]">
        <div className="md:mx-12 flex flex-col items-center gap-4 mb-12 border p-4 pb-6 rounded-md bg-red-200 dark:bg-[#1E212A] mt-12">
          <h1 className="text-2xl font-bold text-center text-red-700">
            Ask a Question
          </h1>
          <form onSubmit={handleSubmit} className="form w-full">
            <div className="title">
              <label className="text-black-800 text-start dark:text-white font-bold text-lg">
                Question Title
              </label>
              <input
                name="title"
                className="mt-2 w-full h-10 px-3 rounded outline-none border-none shadow-sm"
                type="text"
              />
            </div>
            <div className="desc mt-3">
              <label className="text-black-800 text-start dark:text-white font-bold text-lg">
                Question Description
              </label>
              <textarea
                name="description"
                className="mt-2 w-full h-24 px-3 py-2 rounded outline-none border-none shadow-sm"
                type="text"
              />
            </div>
            <div className="tags mt-3">
              <label className="text-black-800 text-start dark:text-white font-bold text-lg">
                Related Tags
              </label>
              <input
                name="tags"
                placeholder="Enter tags separated by comma"
                className="mt-2 w-full h-10 px-3 rounded outline-none border-none shadow-sm"
                type="text"
              />
            </div>
            <button
              type="submit"
              className="mt-8 w-[230px] mx-auto flex items-center gap-2 bg-red-700 rounded-md shadow-sm px-8 py-2 cursor-pointer"
            >
              <BiShare />
              <span className="text-white">Ask on Community</span>
            </button>
          </form>
        </div>
      </div>
    </div>

    </>
  );
};

export default Askquestion;
