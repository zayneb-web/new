import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Home, Login, Profile, Register } from "./pages";
import Chat from "./pages/Chat/Chat.js";
import VideoCall from "./components/VideoCall.js";
//navigate between pages  
function Layout() {
  const { user } = useSelector((state) => state.user);
  const chats = useSelector((state) => state.chat.chats);
  
  //useLocation est utilisé pour obtenir l'entrée actuelle qui représente l'URL où l'application est actuellement rendue.
  const location = useLocation();
//for securtiy if the user have a token then he will have the access to all the pages (outled) sinon login
  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
}

function App() {
  const { theme } = useSelector((state) => state.theme);
  
  return (
    <div data-theme={theme} className='w-full min-h-[100vh]'>
      <Routes>
        {/* all those routes are protected using Layout*/}
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/profile/:id?' element={<Profile />} />
        </Route>

        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/chat' element={<Chat />} />
        <Route path='/video' element={<VideoCall />} />
     

      </Routes>
    </div>
  );
}

export default App;