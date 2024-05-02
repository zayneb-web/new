// chatSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Load initial state from local storage if available
const initialState = {
  chats: [],
  currentChat: null,
  messages: [],
  notification: null,
  badgeCount: 0,
  receivedMessage: null,
 
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats(state, action) {
      state.chats = action.payload;
    },
    setCurrentChat(state, action) {
      state.currentChat = action.payload;
    },
    setMessages(state, action) {
      state.messages = action.payload;
    },
    addMessages(state, action) {
      state.messages.push(action.payload);
      if (action.payload.senderId !== state.user?._id) {
        // Update notification state
        //  state.notification = "New message received";
        // Increment badge count
        // state.badgeCount += 1;
      }
    },
    getChats(state, action) {
      state.chats = action.payload;
    },
    receiveChat(state, action) {
      state.chats.push(action.payload);
    },
    setReceivedMessage(state, action) {
      state.receivedMessage = action.payload;
    },
    receiveMessage(state, action) {
      state.messages.push(action.payload);
      if (action.payload.senderId !== state.user?._id) {
        state.notification = action.payload;
        state.badgeCount += 1; // Increment badge count when a new message is received
      }
    },
    decrementBadgeCount(state, action) {
      const senderId = action.payload;
      const index = state.messages.findIndex(
        (message) => message.senderId === senderId
      );
      if (index !== -1) {
        state.messages.splice(index, 1); // Remove the message for the specific sender
        state.badgeCount = Math.max(state.badgeCount - 1, 0); // Decrement the badge count
      }
    },
  },
});

export const {
  setChats,
  setCurrentChat,
  setMessages,
  addMessages,
  getChats,
  receiveChat,
  setReceivedMessage,
  receiveMessage,
  decrementBadgeCount,
} = chatSlice.actions;

export default chatSlice.reducer;
