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
    ...JSON.parse(window?.localStorage.getItem("chatState")),
  };

  const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
      setChats(state, action) {
        state.chats = action.payload;
        saveState(state); // Save state to local storage
      },
      setCurrentChat(state, action) {
        state.currentChat = action.payload;
        saveState(state); // Save state to local storage
      },
      setMessages(state, action) {
        state.messages = action.payload;
        saveState(state); // Save state to local storage
      },
      addMessages(state, action) {
        state.messages.push(action.payload);
        if (action.payload.senderId !== state.user?._id) {
          // Update notification state
        //  state.notification = "New message received";
          // Increment badge count
         // state.badgeCount += 1;
        }
        saveState(state); // Save state to local storage
      }
,      
      getChats(state, action) {
        state.chats = action.payload;
        saveState(state); // Save state to local storage
      },
      receiveChat(state, action) {
        state.chats.push(action.payload);
        saveState(state); // Save state to local storage
      },
      setReceivedMessage(state, action) {
        state.receivedMessage = action.payload;
        saveState(state); // Save state to local storage
      },
      receiveMessage(state, action) {
        state.messages.push(action.payload);
        if (action.payload.senderId !== state.user?._id) {
          state.notification = action.payload;
          state.badgeCount += 1; // Increment badge count when a new message is received
        }
        saveState(state); // Save state to local storage
      },
    decrementBadgeCount(state, action) {
    const senderId = action.payload;
    const index = state.messages.findIndex(message => message.senderId === senderId);
    if (index !== -1) {
      state.messages.splice(index, 1); // Remove the message for the specific sender
      state.badgeCount = Math.max(state.badgeCount - 1, 0); // Decrement the badge count
    }
    saveState(state); // Save state to local storage
  },

    },
    
  });


  // Save state to local storage
  const saveState = (state) => {
    window.localStorage.setItem("chatState", JSON.stringify(state));
  };

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