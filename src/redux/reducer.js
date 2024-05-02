import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import themeSlice from "./theme";
import postSlice from "./postSlice";
import notificationsSlice from "./notificationsSlice";

import eventSlice from "./eventSlice";

import chatSlice  from "./chatSlice";
import chapterSlice  from "./chapterSlice";


const rootReducer = combineReducers({
  user: userSlice,
  theme: themeSlice,
  posts: postSlice,

  notifications:notificationsSlice,

  chapter: chapterSlice,
  event: eventSlice,

  chat: chatSlice,

});

export { rootReducer };