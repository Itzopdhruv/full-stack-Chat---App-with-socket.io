import React, { useState } from "react";
import { useSelector } from "react-redux";

const GroupMemberActions = ({ member, group, onAction }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);

  const isMainAdmin = group.admin._id === user._id;
  const isAdmin = group.admins?.some(admin => admin._id === user._id) || isMainAdmin;
  const isMemberAdmin = group.admins?.some(admin => admin._id === member._id);
  const isCurrentUser = user._id === member._id;

  const handleMakeAdmin = async () => {
    if (!isAdmin) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/group/${group._id}/make-admin/${member._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      onAction(data);
    } catch (error) {
      console.log("Error making admin:", error);
      alert("Failed to make user admin");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async () => {
    if (!isMainAdmin) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/group/${group._id}/remove-admin/${member._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      onAction(data);
    } catch (error) {
      console.log("Error removing admin:", error);
      alert("Failed to remove admin privileges");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!isAdmin || isCurrentUser) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/group/${group._id}/remove-member/${member._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      onAction(data);
    } catch (error) {
      console.log("Error removing member:", error);
      alert("Failed to remove member");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex flex-col space-y-1">
      {/* Make Admin Button */}
      {isAdmin && !isMemberAdmin && !isCurrentUser && (
        <button
          onClick={handleMakeAdmin}
          disabled={loading}
          className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "..." : "Make Admin"}
        </button>
      )}

      {/* Remove Admin Button */}
      {isMainAdmin && isMemberAdmin && !isCurrentUser && (
        <button
          onClick={handleRemoveAdmin}
          disabled={loading}
          className="text-xs bg-yellow-500 text-white px-3 py-1.5 rounded-md hover:bg-yellow-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "..." : "Remove Admin"}
        </button>
      )}

      {/* Remove Member Button */}
      {isAdmin && !isCurrentUser && (
        <button
          onClick={handleRemoveMember}
          disabled={loading}
          className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-red-600 disabled:opacity-50 transition-colors"
        >
          {loading ? "..." : "Remove Member"}
        </button>
      )}


    </div>
  );
};

export default GroupMemberActions; 