import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import themeSlice from "./theme";
import postSlice from "./postSlice";
import eventSlice from "./eventSlice";

const rootReducer = combineReducers({
  user: userSlice,
  theme: themeSlice,
  posts: postSlice,
  event: eventSlice,
});

export { rootReducer };