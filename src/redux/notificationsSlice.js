import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [], 
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action) {
      state.notifications.push(action.payload);
      console.log('Added notification:', action.payload);
    },
    clearNotifications(state) {
      state.notifications = [];      
      console.log('Cleared notifications');
    },
  },
});

export const { addNotification, clearNotifications } = notificationsSlice.actions;

export default notificationsSlice.reducer;
