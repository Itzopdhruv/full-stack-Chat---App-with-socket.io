import { configureStore } from "@reduxjs/toolkit";
import conversationReducer from "../features/conversationSlice.js";

const store = configureStore({
  reducer: {
    conversation: conversationReducer,
  },
});

export default store;
