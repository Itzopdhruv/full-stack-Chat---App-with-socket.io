import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedConversation: null,
  messages: [],
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setSelectedConversation: (state, action) => {
        
      state.selectedConversation = action.payload;
    },
    setMessages: (state, action) => {
      // Append new messages while keeping the old ones
      // console.log(action.payload , "this is payloadddddddfdddddddddddd");
      // console.log(state.messages , "I am State messages")
      state.messages = action.payload;
    },
    addMessages: (state , action) => {
      
        state.messages[0].push(action.payload);
    },
  },
});

export const { setSelectedConversation, setMessages , addMessages} = conversationSlice.actions;
export default conversationSlice.reducer;
