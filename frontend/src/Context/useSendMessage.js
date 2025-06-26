import React, { useState } from "react";
import { setMessages , addMessages } from "../features/conversationSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const selectedConversation = useSelector((state)=> state.conversation.selectedConversation );
  const messages = useSelector((state) => state.conversation.messages);
  const dispatch = useDispatch();
  const sendMessages = async (message) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `/api/message/send/${selectedConversation._id}`,
        { message }
      );
      dispatch(addMessages(res.data));
      setLoading(false);
    } catch (error) {
      console.log("Error in send messages", error);
      setLoading(false);
    }
  };
  return { loading, sendMessages };
};

export default useSendMessage;