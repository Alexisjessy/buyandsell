// chatSlice.js
import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    notifications: 0,
    error: null,
     hasReadMessages: false,
  },
  reducers: {
  
    addMessage: (state, action) => {
      state.messages.push(action.payload);
       state.notifications += 1;
      state.error = null;
      state.hasReadMessages = true;
    },
    resetNotifications: (state) => {
      state.notifications = 0;
    },
    setHasReadMessages: (state) => {
      state.hasReadMessages = false;  // Marquez les messages comme lus
    },
    removeMessage: (state, action) => {
      const messageIdToRemove = action.payload;
        state.messages = state.messages.filter(msg => msg.message_id !== messageIdToRemove);
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { addMessage, setError, resetNotifications, removeMessage } = chatSlice.actions;
export default chatSlice.reducer;
