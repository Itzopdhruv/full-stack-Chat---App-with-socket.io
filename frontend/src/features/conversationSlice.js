import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedConversation: null,
  messages: [],
  groups: [],
  selectedGroup: null,
  groupMessages: [],
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
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    setSelectedGroup: (state, action) => {
      state.selectedGroup = action.payload;
    },
    setGroupMessages: (state, action) => {
      state.groupMessages = action.payload;
    },
    addGroupMessage: (state, action) => {
      state.groupMessages.push(action.payload);
    },
  },
});

export const { 
  setSelectedConversation, 
  setMessages, 
  addMessages, 
  setGroups, 
  setSelectedGroup, 
  setGroupMessages, 
  addGroupMessage 
} = conversationSlice.actions;
export default conversationSlice.reducer;
