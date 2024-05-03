import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import themeSlice from "./theme";
import postSlice from "./postSlice";
import notificationsSlice from "./notificationsSlice";
import SidebarSlice from "./SideBarSlice";
import onlineSlice from "./onlineSlice"
import eventSlice from "./eventSlice";

import chatSlice  from "./chatSlice";


const rootReducer = combineReducers({
  user: userSlice,
  theme: themeSlice,
  posts: postSlice,
  notifications:notificationsSlice,
  sidebar:SidebarSlice,
  online: onlineSlice,
  event: eventSlice,
  chat: chatSlice,

});

export { rootReducer };