import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useGetAllUsers from "../Context/useGetAllUsers.jsx";

const CreateGroup = ({ onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allUsers] = useGetAllUsers();
  const { user } = useSelector((state) => state.user);

  const handleMemberToggle = (userId) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || selectedMembers.length < 1) {
      alert("Please provide group name and select at least one member");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/group/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: groupName,
          description,
          members: selectedMembers,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      onGroupCreated(data);
      onClose();
    } catch (error) {
      console.log("Error creating group: ", error.message);
      alert("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Create New Group</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Group Name</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter group name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter group description"
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Members</label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
              {allUsers
                .filter(userItem => userItem._id !== user._id)
                .map((userItem) => (
                  <div key={userItem._id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={userItem._id}
                      checked={selectedMembers.includes(userItem._id)}
                      onChange={() => handleMemberToggle(userItem._id)}
                      className="mr-2"
                    />
                    <label htmlFor={userItem._id} className="flex items-center">
                      <img
                        src={userItem.photo}
                        alt={userItem.fullname}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span>{userItem.fullname}</span>
                    </label>
                  </div>
                ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup; 