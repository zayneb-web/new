import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import themeSlice from "./theme";
import postSlice from "./postSlice";
import chatSlice  from "./chatSlice";

const rootReducer = combineReducers({
  user: userSlice,
  theme: themeSlice,
  posts: postSlice,
  chat: chatSlice,
});

export { rootReducer };