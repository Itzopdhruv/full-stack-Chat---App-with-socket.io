import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import useGetGroupMessages from "../../Context/useGetGroupMessages.jsx";
import useSendGroupMessage from "../../Context/useSendGroupMessage.jsx";
import { addGroupMessage, setSelectedGroup } from "../../features/conversationSlice.js";
import GroupMemberActions from "../../Components/GroupMemberActions.jsx";
import AddMembersToGroup from "../../Components/AddMembersToGroup.jsx";
import DeleteGroupButton from "../../Components/DeleteGroupButton.jsx";

const GroupChat = () => {
  const [message, setMessage] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();
  
  const { selectedGroup, groupMessages } = useSelector((state) => state.conversation);
  const { user } = useSelector((state) => state.user);
  
  const { loading: messagesLoading } = useGetGroupMessages(selectedGroup?._id);
  const { sendGroupMessage, loading: sendLoading } = useSendGroupMessage();

  const handleGroupUpdate = (updatedGroup) => {
    dispatch(setSelectedGroup(updatedGroup));
  };

  const handleMembersAdded = (updatedGroup) => {
    dispatch(setSelectedGroup(updatedGroup));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [groupMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedGroup) return;

    // Check if user is an active member (not removed)
    const isActiveMember = selectedGroup.members.some(member => member._id === user._id);
    if (!isActiveMember) {
      alert("You have been removed from this group and cannot send messages.");
      return;
    }

    try {
      await sendGroupMessage(selectedGroup._id, message);
      setMessage("");
    } catch (error) {
      console.log("Error sending message:", error);
      if (error.message.includes("not an active member")) {
        alert("You have been removed from this group and cannot send messages.");
      }
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!selectedGroup) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center text-gray-400">
          <h2 className="text-2xl font-semibold mb-2">Select a Group</h2>
          <p>Choose a group from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900 h-screen">
      {/* Group Header */}
      <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-3">
          <img
            src={selectedGroup.photo}
            alt={selectedGroup.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="text-white font-semibold text-lg">{selectedGroup.name}</h2>
            <p className="text-gray-400 text-sm">
              {selectedGroup.members.length} active members
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowMembers(!showMembers)}
          className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Delete Group Button for Removed Members */}
            <DeleteGroupButton group={selectedGroup} />
            
            {messagesLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : groupMessages.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <p>No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            ) : (
              groupMessages.map((msg) => (
                <div
                  key={msg._id}
                  className={`flex ${msg.senderId._id === user._id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.senderId._id === user._id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {msg.senderId._id !== user._id && (
                      <div className="text-xs text-gray-300 mb-1">
                        {msg.senderId.fullname}
                      </div>
                    )}
                    <p>{msg.message}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {formatTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

                {/* Members Sidebar - Increased Size */}
        {showMembers && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold text-lg">Group Members</h3>
              {/* Add Members Button - Only for admins */}
              {(selectedGroup.admin._id === user._id || selectedGroup.admins?.some(admin => admin._id === user._id)) && (
                <button
                  onClick={() => setShowAddMembers(true)}
                  className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 transition-colors"
                >
                  Add Members
                </button>
              )}
            </div>
            
            {/* Active Members */}
            <div className="mb-6">
              <h4 className="text-gray-300 text-sm font-medium mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Active Members ({selectedGroup.members.length})
              </h4>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {selectedGroup.members.map((member) => (
                  <div key={member._id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.photo}
                        alt={member.fullname}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">{member.fullname}</p>
                        <div className="flex gap-2 mt-1">
                          {member._id === selectedGroup.admin._id && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">Main Admin</span>
                          )}
                          {selectedGroup.admins?.some(admin => admin._id === member._id) && member._id !== selectedGroup.admin._id && (
                            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Admin</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <GroupMemberActions 
                      member={member} 
                      group={selectedGroup} 
                      onAction={handleGroupUpdate}
                    />
                  </div>
                ))}
              </div>
            </div>

 
          </div>
        )}

        {/* Add Members Modal */}
        {showAddMembers && (
          <AddMembersToGroup
            group={selectedGroup}
            onClose={() => setShowAddMembers(false)}
            onMembersAdded={handleMembersAdded}
          />
        )}
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="bg-gray-900 border-t border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              selectedGroup.members.some(member => member._id === user._id) 
                ? "Type a message..." 
                : "You have been removed from this group"
            }
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={sendLoading || !selectedGroup.members.some(member => member._id === user._id)}
          />
          <button
            type="submit"
            disabled={!message.trim() || sendLoading || !selectedGroup.members.some(member => member._id === user._id)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupChat; 