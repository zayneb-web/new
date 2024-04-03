import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import themeSlice from "./theme";
import postSlice from "./postSlice";

import eventSlice from "./eventSlice";

import chatSlice  from "./chatSlice";


const rootReducer = combineReducers({
  user: userSlice,
  theme: themeSlice,
  posts: postSlice,

  event: eventSlice,

  chat: chatSlice,

});

export { rootReducer };