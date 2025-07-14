import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Group from "./Group.jsx";
import CreateGroup from "../../Components/CreateGroup.jsx";
import useGetGroups from "../../Context/useGetGroups.jsx";
import { setGroups } from "../../features/conversationSlice.js";

function Groups() {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const { groups } = useSelector((state) => state.conversation);
  const dispatch = useDispatch();
  const { loading } = useGetGroups();

  const handleGroupCreated = (newGroup) => {
    dispatch(setGroups([newGroup, ...groups]));
  };

  if (loading) {
    return (
      <div className="px-8 py-2">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between px-8 py-2">
        <h1 className="text-white font-semibold bg-slate-800 rounded-md px-3 py-1">
          Groups
        </h1>
        <button
          onClick={() => setShowCreateGroup(true)}
          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors"
        >
          Create Group
        </button>
      </div>
      
      <div
        className="py-2 flex-1 overflow-y-auto"
        style={{ maxHeight: "calc(84vh - 10vh)" }}
      >
        {groups.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No groups yet</p>
            <p className="text-sm">Create a group to start chatting!</p>
          </div>
        ) : (
          groups.map((group) => (
            <Group key={group._id} group={group} />
          ))
        )}
      </div>

      {showCreateGroup && (
        <CreateGroup
          onClose={() => setShowCreateGroup(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}
    </div>
  );
}

export default Groups; 