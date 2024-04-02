import { createSlice } from "@reduxjs/toolkit";
import { user } from "../assets/data";

const initialState = {
  user: JSON.parse(window?.localStorage.getItem("user")) ?? user,
  edit: false,
};
//Ces méthodes décrivent comment l'état doit changer en réponse à une action spécifique.
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;   //met à jour la propriété user du state avec la valeur de action.payload qui est stockée dans le local storage.
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      state.user = null;
      localStorage?.removeItem("user");
    },
    updateProfile(state, action) {
      state.edit = action.payload;
    },
    setOpenSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
  },
});
export default userSlice.reducer;
//Ces fonctions sont des créateurs d'actions et utilisées pour déclencher des changements d'état dans votre application.
export function UserLogin(user) {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.login(user));
  };
}

export function Logout() {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.logout());
  };
}

export function UpdateProfile(val) {
  return (dispatch, getState) => {
    dispatch(userSlice.actions.updateProfile(val));
  }; 
}
//Sidebar function
  export function setOpenSidebar(open) {
    return (dispatch, getState) => {
      dispatch(userSlice.actions.setOpenSidebar(open));
    };
};