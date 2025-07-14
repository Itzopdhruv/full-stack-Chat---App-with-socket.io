import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedGroup, setSelectedConversation } from "../../features/conversationSlice.js";

const Group = ({ group }) => {
  const dispatch = useDispatch();
  const { selectedGroup } = useSelector((state) => state.conversation);

  const handleGroupClick = () => {
    dispatch(setSelectedGroup(group));
    dispatch(setSelectedConversation(null)); // Clear selected conversation
  };

  const isSelected = selectedGroup?._id === group._id;

  return (
    <div
      onClick={handleGroupClick}
      className={`flex items-center gap-3 p-3 hover:bg-gray-800 cursor-pointer transition-colors ${
        isSelected ? "bg-gray-800" : ""
      }`}
    >
      <div className="relative">
        <img
          src={group.photo}
          alt={group.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white truncate">{group.name}</h3>
          <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded-full">
            {group.members.length} members
          </span>
        </div>
        <p className="text-sm text-gray-400 truncate">
          {group.description || "No description"}
        </p>
      </div>
    </div>
  );
};

export default Group; 