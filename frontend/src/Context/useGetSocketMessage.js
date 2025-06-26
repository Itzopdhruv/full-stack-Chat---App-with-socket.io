import React, { useEffect } from "react";
import { useSocketContext } from "./SocketContext";
import { setMessages , addMessages } from "../features/conversationSlice";
import sound from "../assets/notification.mp3";
import { useDispatch, useSelector } from "react-redux";
const useGetSocketMessage = () => {
  const { socket } = useSocketContext();
  
  const messages = useSelector((state) => state.conversation.messages);
  const dispatch = useDispatch();
  useEffect(() => {
    socket.on("newMessage", (newMessage) => {
      const notification = new Audio(sound);
      notification.play();
      dispatch(addMessages(newMessage));
    });
    return () => {
      socket.off("newMessage");
    };
  }, [socket, messages]);
};
export default useGetSocketMessage;