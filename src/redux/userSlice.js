import { createSlice } from "@reduxjs/toolkit";
import { user } from "../assets/data";



const initialState = {
  user: JSON.parse(window?.localStorage.getItem("user")) ?? {},
  edit: false,
  users: [], // Add users array to store user data
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      localStorage?.removeItem("user");
    },
    updateProfile(state, action) {
      state.edit = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});
export default userSlice.reducer;

export const { login, logout, updateProfile, setUsers } = userSlice.actions; // Export actions directly

// Thunk actions can be created separately if needed
export const UserLogin = (user) => (dispatch) => {
  dispatch(login(user));
};

export const Logout = () => (dispatch) => {
  dispatch(logout());
};

export const UpdateProfile = (val) => (dispatch) => {
  dispatch(updateProfile(val));
};

export const SetUsers = (users) => (dispatch) => {
  dispatch(setUsers(users));
};

//Sidebar function
export function setOpenSidebar(open) {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.setOpenSidebar(open));
  };

};