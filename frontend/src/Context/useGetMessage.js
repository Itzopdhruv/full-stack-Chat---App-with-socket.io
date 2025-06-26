import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages} from "../features/conversationSlice.js";
import axios from "axios";

const useGetMessage = () => {
  const dispatch = useDispatch();
 const [loading , setloading] = useState(false)
  // Get state from Redux
  const messages = useSelector((state) => state.conversation.messages);
  const selectedConversation = useSelector((state) => state.conversation.selectedConversation);
  

  useEffect(() => {
    const getMessages = async () => {
        setloading(true)
      if (!selectedConversation || !selectedConversation._id) return;
      
     
      try {
        const res = await axios.get(`/api/message/get/${selectedConversation._id}`);
       
        dispatch(setMessages([res.data])); // Store messages in Redux
        setloading(false)
      } catch (error) {
        console.error("Error in getting messages:", error);
        setloading(false)
      } 
    };

    getMessages();
  }, [selectedConversation, dispatch]);
 
  return { loading, messages };
};

export default useGetMessage;
