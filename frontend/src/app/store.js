import { configureStore } from "@reduxjs/toolkit";
import conversationReducer from "../features/conversationSlice.js";
import userReducer from "../features/userSlice.js";

const store = configureStore({
  reducer: {
    conversation: conversationReducer,
    user: userReducer,
  },
});

export default store;


