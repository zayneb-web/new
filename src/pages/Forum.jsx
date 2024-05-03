import './style.css';
import CreateButton from "../components/Forum/CreateButton";
import Topbar from "../components/TopBar";
import SidebarForum from "../components/Forum/SidebarForum";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Register from "../pages/Register";
import Login from "../pages/Login";
import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import Notfound from "../components/Forum/NotFound";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { apiRequest } from "../utils/api";
import { Link } from "react-router-dom";
import { BsPersonFillAdd } from "react-icons/bs";
import { NoProfile } from "../assets";


const queryClient = new QueryClient();


const Forum = () => {
  const { user } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [suggestedFriends, setSuggestedFriends] = useState([]);

  const fetchSuggestedFriends = async () => {
    try {
      const res = await apiRequest({
        url: "/users/suggested-friends",
        token: user?.token,
        method: "POST",
      });
      setSuggestedFriends(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSuggestedFriends();
  }, []); // Add fetchSuggestedFriends as a dependency

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      window.location.href = "/login";
    }

    const socket = io("http://localhost:5000", {
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log("socket connected");
      socket.emit("new-user-add", user._id);
    });

    socket.on("get-users", (users) => {
      console.log("Received get-users event with users:", users);
      setUsers(users);
    });

    const fetchAllUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/forum/allusers", {});
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();

    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  return (
    <>
  <Topbar />
<QueryClientProvider client={queryClient} contextSharing={true}>
  <div className="relative w-screen flex flex-col justify-center items-center overflow-x-hidden bg-white dark:bg-[#32353F]">
    <div className="w-full h-screen flex justify-center items-start px-4 md:px-12 pt-12 bottom-50 md:top-60 dark:bg-[#32353F]">
      <SidebarForum className="sidebar-forum"  />
      <Outlet />
      <div className="right-section hidden md:block h-80 fixed z-10  bottom-50 md:top-40 top-24 right-28">
        <CreateButton className="create-button" />
              <div className="mt-8 py-4 px-3 rounded-md flex flex-col items-start gap-5">
                <h2 className="text-gray-600 font-bold text-start">Top Users</h2>
                {suggestedFriends?.map((friend) => (
                  <div className="flex items-center justify-between" key={friend._id}>
                    <Link
                      to={"/profile/" + friend?._id}
                      key={friend?._id}
                      className="w-full flex gap-4 items-center cursor-pointer"
                    >
                      <img
                        src={friend?.profileUrl ?? NoProfile} // Update to handle missing profileUrl
                        alt={friend?.firstName}
                        className="w-10 h-10 object-cover rounded-full"
                      />
                      <div className="flex-1 ">
                        <p className="text-base font-medium text-ascent-1">
                          {friend?.firstName} {friend?.lastName}
                        </p>
                        <span className="text-sm text-ascent-2">
                          {friend?.profession ?? "No Profession"}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forum",
    element: <Forum />,
  },
  {
    path: "*",
    element: <Notfound />,
  },
]);

export default Forum;
