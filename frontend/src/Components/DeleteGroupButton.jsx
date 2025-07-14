import React, { useState } from "react";
import { useSelector } from "react-redux";

const DeleteGroupButton = ({ group }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);

  // Only show to removed members
  if (!group.removedMembers?.includes(user._id)) {
    return null;
  }

  const handleDeleteGroup = async () => {
    if (!confirm("Are you sure you want to remove this group from your view? You won't be able to see the messages anymore.")) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/group/${group._id}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Redirect to groups list or refresh
      window.location.reload();
    } catch (error) {
      console.log("Error removing group:", error);
      alert("Failed to remove group from your view");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-red-200 font-medium">You have been removed from this group</h3>
          <p className="text-red-300 text-sm mt-1">You can still view messages but cannot send new ones. Click "Remove from View" to hide this group.</p>
        </div>
        <button
          onClick={handleDeleteGroup}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Removing..." : "Remove from View"}
        </button>
      </div>
    </div>
  );
};

export default DeleteGroupButton; 