import React, { useState } from "react";
import { useSelector } from "react-redux";
import useGetAllUsers from "../Context/useGetAllUsers.jsx";

const AddMembersToGroup = ({ group, onClose, onMembersAdded }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allUsers] = useGetAllUsers();
  const { user } = useSelector((state) => state.user);

  // Filter out users who are already in the group
  const availableUsers = allUsers.filter(
    (userItem) => 
      userItem._id !== user._id && 
      !group.members.some(member => member._id === userItem._id) &&
      !group.removedMembers?.some(removedMember => removedMember._id === userItem._id)
  );

  const handleMemberToggle = (userId) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedMembers.length === 0) {
      alert("Please select at least one member to add");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/group/${group._id}/add-members`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          members: selectedMembers,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      onMembersAdded(data);
      onClose();
    } catch (error) {
      console.log("Error adding members:", error);
      alert("Failed to add members to group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Add Members to {group.name}</h2>
        
        {availableUsers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No users available to add</p>
            <p className="text-sm text-gray-400 mt-2">All users are already in this group</p>
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Members to Add</label>
              <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
                {availableUsers.map((userItem) => (
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
                disabled={loading || selectedMembers.length === 0}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Adding..." : `Add ${selectedMembers.length} Member${selectedMembers.length !== 1 ? 's' : ''}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddMembersToGroup; 