import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";


import EmailVerificationSuccess from "./pages/EmailVerificationSuccess.jsx";
import SingleEvent from "./pages/SingleEvent";
import MyEvents from "./pages/MyEvents";
import EditEventForm from "./components/EditEventForm";

import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import DashbordAdmin from "./pages/DashbordAdmin.jsx";
import { Toaster } from "sonner";
import {
  Home,
  Login,
  Profile,
  Register,
  VideoPage,
  RoomPage,
  Event,
  ResetPassword,
} from "./pages";
import CreateCoursePage from "./components/courses/CreateCourse";
import MyCourse from "./pages/MyCourse";
import AllCourse from "./pages/AllCourse";
import UpdateCoursePage from "./components/courses/UpdateCourse";
import TasksList from "./components/tasks/TasksList";
import Chapter from "./pages/chapter.jsx";
import AddChapter from "./components/chapters/AddChapter.jsx";
import ChapterDetails from "./components/chapters/ChapterDetails.jsx";

import Chat from "./pages/Chat/Chat.js";
import VideoCall from "./components/VideoCall.js";
import Cancel from "./components/Cancel";
import Success from "./components/Success";
import Quizs from "./components/Quiz/Quizs.jsx";
import QuizCreation from "./components/Quiz/QuizCreation.jsx";
import Summarizer from "./components/summarizer.jsx";
import PdfSummarizer from "./components/PdfSummarizer.jsx";

//navigate between pages
function Layout() {
  const { user } = useSelector((state) => state?.user);
  const chats = useSelector((state) => state.chat?.chats);

  //useLocation est utilisé pour obtenir l'entrée actuelle qui représente l'URL où l'application est actuellement rendue.
  const location = useLocation();
  //for securtiy if the user have a token then he will have the access to all the pages (outled) sinon login
  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

function App() {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div data-theme={theme} className="w-full min-h-[100vh]">
      <Routes>
        {/* all those routes are protected using Layout*/}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Home />} />

          <Route path="/profile/:id?" element={<Profile />} />
          <Route path="/dashboard/:id?" element={<DashbordAdmin />} />
          <Route path="/VideoPage" element={<VideoPage />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
          <Route path="/course" element={<MyCourse />} />
          <Route path="/allcourse" element={<AllCourse />} />
          <Route path="/course/:id" element={<UpdateCoursePage />} />
          <Route path="/addcourse" element={<CreateCoursePage />} />
          <Route path="/task" element={<TasksList />} />
          <Route path="/chapter" element={<Chapter />} />
          <Route path="/addchapter" element={<AddChapter />} />
          <Route path="/ChapterDetails/:id" element={<ChapterDetails />} />
          <Route path="/summarizer" element={<Summarizer />} />
          <Route path="/pdfsummarizer" element={<PdfSummarizer />} />
        </Route>

        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/users/reset-password/:userId/:token"
          element={<ResetPasswordPage />}
        />
        <Route path="/emailVerif" element={<EmailVerificationSuccess />} />
        <Route path="/event" element={<Event />} />

        <Route path="/event/:id" element={<SingleEvent />} />
        <Route path="/myevents" element={<MyEvents />} />
        <Route path="/edit-event/:id" element={<EditEventForm />} />

        <Route path="/chat" element={<Chat />} />
        <Route path="/video" element={<VideoCall />} />

        {/* quizs routes  */}
        <Route path="/quiz" element={<Quizs />} />
        <Route path="/QuizCreation" element={<QuizCreation />} />
      </Routes>

      <Toaster richColors />
    </div>
  );
}

export default App;
