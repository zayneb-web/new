import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toggle } from "../../redux/SideBarSlice";
import { BiHome, BiSearch, BiQuestionMark } from "react-icons/bi"; // Import icons from react-icons/bi

const SidebarForum = () => {
  const navigate = useNavigate();
  const location = window.location.pathname;
  const open = useSelector((state) => state.sidebar.open);
  const dispatch = useDispatch();
  const active =
    "bg-purple-100 text-purple-500 px-8 py-10 rounded-sm border-l-4 border-purple-700";
  const askQuestionStyle =
    "md:hidden flex items-center justify-center gap-2 px-4 py-2 cursor-pointer bg-purple-600 mx-4 rounded-md text-white font-bold";

  return (
    <div
      className={`${
        open ? "block" : "hidden"
      } md:block w-[60%] md:w-[15%] h-full md:h-80 fixed left-0 md:left-28 z-10 bottom-50 md:top-40 list-none text-gray-300 text-sm space-y-4 py-8 md:py-0 dark:bg-gray-800 shadow-md md:shadow-none`}
    >
      <li
        onClick={() => navigate("/")}
        className={
          "flex items-center gap-2 mx-2 md:mx-0 px-4 py-1 hover:cursor-pointer " +
          (location === "/" ? active : " ")
        }
      >
        <BiHome className="w-6 h-6 text-black" /> {/* Larger black BiHome icon */}
        <span className="text-black font-bold">HOME</span>
      </li>
      <li
        onClick={() => navigate("/explore")}
        className={
          "flex items-center gap-2 mx-2 md:mx-0 px-4 py-1 cursor-pointer " +
          (location === "/explore" ? active : "")
        }
      >
        <BiSearch className="w-6 h-6 text-black" /> {/* Larger black BiSearch icon */}
        <span className="text-black font-bold">EXPLORE TOPICS</span>
      </li>

      <li
        onClick={() => navigate("/myqna")}
        className={
          "flex items-center gap-2 mx-2 md:mx-0 px-4 py-1 cursor-pointer " +
          (location === "/myqna" ? active : "")
        }
      >
        <BiQuestionMark className="w-6 h-6 text-black" /> {/* Larger black BiQuestionMark icon */}
        <span className="text-black font-bold">MY QNA</span>
      </li>

      <li
        onClick={() => {
          navigate("/ask");
          dispatch(toggle());
        }}
        className={askQuestionStyle}
      >
        <BiQuestionMark className="w-6 h-6 text-black" /> {/* Larger black BiQuestionMark icon */}
        <span>Ask a Question</span>
      </li>
    </div>
  );
};

export default SidebarForum;
