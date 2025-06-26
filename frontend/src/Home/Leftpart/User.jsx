import React from "react";
// import useConversation from "../../statemanage/useConversation.js";
// import { useSocketContext } from "../../context/SocketContext.jsx";
import { setSelectedConversation } from "../../features/conversationSlice";
import { useDispatch, useSelector } from "react-redux";

function User({ user }) {
 const dispatch = useDispatch();
 const selectedConversation = useSelector((state) => state.conversation.selectedConversation);
  const isSelected = selectedConversation?._id === user._id;
//   const { socket, onlineUsers } = useSocketContext();
//   const isOnline = onlineUsers.includes(user._id);
const isOnline = true;
   
  return (
    <div
      className={`hover:bg-slate-600 duration-300 ${
        isSelected ? "bg-slate-700" : ""
      }`}
      onClick={() =>{dispatch(setSelectedConversation(user))
        
      } }
    >
      <div className="flex space-x-4 px-8 py-3 hover:bg-slate-700 duration-300 cursor-pointer">
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-12 rounded-full">
             <img src= {user.photo} />
        
          </div>
        </div>
        <div>
          <h1 className=" font-bold">{user.fullname}</h1>
          <span>{user.email}</span>
        </div>
      </div>
    </div>
  );
}

export default User;